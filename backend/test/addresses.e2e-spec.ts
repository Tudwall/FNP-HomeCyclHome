import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from 'prisma/prisma.service';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { configureApp } from 'src/configure-app';

const DOMAIN = '@addresses-e2e.test';

describe('Address (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let prisma: PrismaService;

  const password = 'password123';
  const ownerEmail = `owner${DOMAIN}`;
  const otherEmail = `other${DOMAIN}`;
  let ownerId: number;

  const valid = {
    number: '12',
    street: 'rue des Lilas',
    postalCode: '35000',
    locality: 'Rennes',
  };

  async function signup(email: string): Promise<number> {
    const res = await request(server)
      .post('/auth/signup')
      .send({ email, password, firstName: 'A', lastName: 'B' })
      .expect(201);
    return (res.body as { id: number }).id;
  }

  async function agentFor(email: string) {
    const agent = request.agent(server);
    await agent.post('/auth/login').send({ email, password }).expect(200);
    return agent;
  }

  async function cleanup() {
    await prisma.address.deleteMany({
      where: { appUser: { email: { endsWith: DOMAIN } } },
    });
    await prisma.appUser.deleteMany({ where: { email: { endsWith: DOMAIN } } });
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
    server = app.getHttpServer();

    prisma = app.get(PrismaService);
    await cleanup();

    ownerId = await signup(ownerEmail);
    await signup(otherEmail);
  });

  afterAll(async () => {
    await cleanup();
    await app.close();
  });

  describe('sans cookie', () => {
    it('GET /address -> 401', async () => {
      await request(server).get('/address').expect(401);
    });

    it('PUT /address -> 401', async () => {
      await request(server).put('/address').send(valid).expect(401);
    });
  });

  describe('validation', () => {
    it.each([
      ['code postal à 4 chiffres', { ...valid, postalCode: '3500' }],
      ["rue composée d'espaces", { ...valid, street: '    ' }],
      [
        'ville manquante',
        { street: valid.street, postalCode: valid.postalCode },
      ],
      ['userId dans le body', { ...valid, userId: 1 }],
      ['country dans le body', { ...valid, country: 'Belgique' }],
    ])('PUT avec %s -> 400', async (_label, body) => {
      const agent = await agentFor(otherEmail);
      await agent.put('/address').send(body).expect(400);
    });
  });

  describe('cycle de vie', () => {
    it("404 -> PUT -> GET -> 2e PUT remplace et conserve l'historique", async () => {
      const owner = await agentFor(ownerEmail);

      await owner.get('/address').expect(404);

      const first = await owner.put('/address').send(valid).expect(200);
      expect(first.body).toEqual({
        id: expect.any(Number),
        ...valid,
        country: 'France',
      });
      const got = await owner.get('/address').expect(200);
      expect(got.body).toEqual(first.body);

      const next = {
        street: 'avenue Janvier',
        postalCode: '35000',
        locality: 'Rennes',
      };

      const second = await owner.put('/address').send(next).expect(200);
      expect(second.body).toMatchObject({ ...next, number: null });
      expect(second.body.id).not.toBe(first.body.id);
      const gotAgain = await owner.get('/address').expect(200);
      expect(gotAgain.body).toEqual(second.body);

      const rows = await prisma.address.findMany({
        where: { userId: ownerId },
      });
      expect(rows).toHaveLength(2);
      expect(rows.filter((r) => r.deletedOn === null)).toHaveLength(1);
    });

    it("l'adresse d'un autre n'est jamais visible", async () => {
      const other = await agentFor(otherEmail);
      await other.get('/address').expect(404);
    });
  });
});
