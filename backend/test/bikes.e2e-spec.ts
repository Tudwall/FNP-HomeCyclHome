import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from 'src/configure-app';
import { PrismaService } from 'prisma/prisma.service';

// Domaine distinct du préfixe `e2e-` nettoyé par users.e2e-spec.ts
const DOMAIN = '@bikes-e2e.test';
const REF = 'E2E bikes';

describe('Bikes (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let prisma: PrismaService;

  const password = 'password123';
  const ownerEmail = `owner${DOMAIN}`;
  const otherEmail = `other${DOMAIN}`;

  let ownerId: number;
  let typeId: number;
  let otherTypeId: number;
  let bikeModelId: number;

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

  async function createBike(email: string): Promise<number> {
    const agent = await agentFor(email);
    const res = await agent
      .post('/bikes')
      .send({ bikeModelId, typeId })
      .expect(201);
    return (res.body as { id: number }).id;
  }

  // Ordre inverse des FK (onDelete: NoAction)
  async function cleanup() {
    await prisma.bike.deleteMany({
      where: { appUser: { email: { endsWith: DOMAIN } } },
    });
    await prisma.appUser.deleteMany({ where: { email: { endsWith: DOMAIN } } });
    await prisma.bikeModel.deleteMany({ where: { name: { startsWith: REF } } });
    await prisma.bikeBrand.deleteMany({ where: { name: { startsWith: REF } } });
    await prisma.bikeType.deleteMany({ where: { name: { startsWith: REF } } });
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

    typeId = (await prisma.bikeType.create({ data: { name: `${REF} type A` } }))
      .id;
    otherTypeId = (
      await prisma.bikeType.create({ data: { name: `${REF} type B` } })
    ).id;
    bikeModelId = (
      await prisma.bikeModel.create({
        data: {
          name: `${REF} model`,
          bikeBrand: { create: { name: `${REF} brand` } },
        },
      })
    ).id;

    ownerId = await signup(ownerEmail);
    await signup(otherEmail);
  });

  afterAll(async () => {
    await cleanup();
    await app.close();
  });

  describe('sans cookie', () => {
    it('GET /bikes -> 401', async () => {
      await request(server).get('/bikes').expect(401);
    });

    it('POST /bikes -> 401', async () => {
      await request(server)
        .post('/bikes')
        .send({ bikeModelId, typeId })
        .expect(401);
    });
  });

  describe('POST /bikes', () => {
    it('201 + rattaché au user du token + détails inclus', async () => {
      const agent = await agentFor(ownerEmail);
      const res = await agent
        .post('/bikes')
        .send({ bikeModelId, typeId })
        .expect(201);

      expect(res.body).toMatchObject({
        userId: ownerId,
        bikeModelId,
        typeId,
        deletedOn: null,
        bikeType: { id: typeId, name: `${REF} type A` },
        bikeModel: {
          id: bikeModelId,
          bikeBrand: { name: `${REF} brand` },
        },
      });
    });

    it('userId dans le body -> 400 (forbidNonWhitelisted)', async () => {
      const agent = await agentFor(ownerEmail);
      await agent
        .post('/bikes')
        .send({ bikeModelId, typeId, userId: 1 })
        .expect(400);
    });

    it('champs invalides -> 400', async () => {
      const agent = await agentFor(ownerEmail);
      await agent
        .post('/bikes')
        .send({ bikeModelId: 'abc', typeId: -1 })
        .expect(400);
    });

    it('modèle inexistant -> 400 (FK, P2003)', async () => {
      const agent = await agentFor(ownerEmail);
      await agent
        .post('/bikes')
        .send({ bikeModelId: 999999, typeId })
        .expect(400);
    });
  });

  describe('GET /bikes', () => {
    it('ne liste que les vélos du user connecté', async () => {
      const mine = await createBike(ownerEmail);
      const theirs = await createBike(otherEmail);

      const agent = await agentFor(ownerEmail);
      const res = await agent.get('/bikes').expect(200);
      const ids = (res.body as { id: number }[]).map((b) => b.id);

      expect(ids).toContain(mine);
      expect(ids).not.toContain(theirs);
    });
  });

  describe('GET /bikes/:id', () => {
    it('son vélo -> 200', async () => {
      const id = await createBike(ownerEmail);
      const agent = await agentFor(ownerEmail);
      const res = await agent.get(`/bikes/${id}`).expect(200);
      expect(res.body).toMatchObject({ id, userId: ownerId });
    });

    it('id non numérique -> 400 (ParseIntPipe)', async () => {
      const agent = await agentFor(ownerEmail);
      await agent.get('/bikes/abc').expect(400);
    });

    it('id inexistant -> 404', async () => {
      const agent = await agentFor(ownerEmail);
      await agent.get('/bikes/999999').expect(404);
    });
  });

  describe('le vélo d’autrui', () => {
    it('GET, PATCH, DELETE -> 404, et le vélo reste intact', async () => {
      const id = await createBike(ownerEmail);
      const intruder = await agentFor(otherEmail);

      await intruder.get(`/bikes/${id}`).expect(404);
      await intruder
        .patch(`/bikes/${id}`)
        .send({ typeId: otherTypeId })
        .expect(404);
      await intruder.delete(`/bikes/${id}`).expect(404);

      const owner = await agentFor(ownerEmail);
      const res = await owner.get(`/bikes/${id}`).expect(200);
      expect(res.body).toMatchObject({ typeId, deletedOn: null });
    });
  });

  describe('cycle sur son vélo', () => {
    it('PATCH 200 -> DELETE 204 -> plus rien en GET/PATCH/DELETE ni en liste', async () => {
      const id = await createBike(ownerEmail);
      const agent = await agentFor(ownerEmail);

      const patched = await agent
        .patch(`/bikes/${id}`)
        .send({ typeId: otherTypeId })
        .expect(200);
      expect(patched.body).toMatchObject({
        typeId: otherTypeId,
        bikeType: { name: `${REF} type B` },
      });

      const deleted = await agent.delete(`/bikes/${id}`).expect(204);
      expect(deleted.text).toBe('');

      await agent.get(`/bikes/${id}`).expect(404);
      await agent.patch(`/bikes/${id}`).send({ typeId }).expect(404);
      await agent.delete(`/bikes/${id}`).expect(404);

      const list = await agent.get('/bikes').expect(200);
      const ids = (list.body as { id: number }[]).map((b) => b.id);
      expect(ids).not.toContain(id);
    });
  });
});
