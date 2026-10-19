import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { configureApp } from 'src/configure-app';
import { PrismaService } from 'prisma/prisma.service';

const DOMAIN = '@catalog-e2e.test';
const REF = 'E2E CATALOG';

type Named = { id: number; name: string };
type Brand = Named & { models: Named[] };

describe('Catalog (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let prisma: PrismaService;

  const email = `user${DOMAIN}`;
  const password = `password123`;

  let typeId: number;
  let brandId: number;
  let modelAId: number;
  let modelBId: number;

  async function cleanUp() {
    await prisma.appUser.deleteMany({
      where: { email: { endsWith: DOMAIN } },
    });
    await prisma.bikeModel.deleteMany({ where: { name: { startsWith: REF } } });
    await prisma.bikeBrand.deleteMany({ where: { name: { startsWith: REF } } });
    await prisma.bikeType.deleteMany({ where: { name: { startsWith: REF } } });
  }

  async function loggedAgent() {
    const agent = request.agent(server);
    await agent.post('/auth/login').send({ email, password }).expect(200);
    return agent;
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
    await cleanUp();

    typeId = (await prisma.bikeType.create({ data: { name: `${REF} type` } }))
      .id;
    brandId = (
      await prisma.bikeBrand.create({ data: { name: `${REF} brand` } })
    ).id;

    modelBId = (
      await prisma.bikeModel.create({
        data: { name: `${REF} model B`, brandId },
      })
    ).id;

    modelAId = (
      await prisma.bikeModel.create({
        data: { name: `${REF} model A`, brandId },
      })
    ).id;

    await request(server)
      .post('/auth/signup')
      .send({ email, password, firstName: 'A', lastName: 'B' })
      .expect(201);
  });

  afterAll(async () => {
    await cleanUp();
    await app.close();
  });

  describe('sans cookie', () => {
    it('GET /bike-types -> 401', async () => {
      await request(server).get('/catalog/bike-types').expect(401);
    });

    it('GET /bike-brands -> 401', async () => {
      await request(server).get('/catalog/bike-brands').expect(401);
    });
  });

  describe('GET /bike-types', () => {
    it('200 et contient le type sans champs en trop', async () => {
      const agent = await loggedAgent();
      const res = await agent.get('/catalog/bike-types').expect(200);
      const types = res.body as Named[];

      expect(types).toContainEqual({ id: typeId, name: `${REF} type` });
    });
  });

  describe('GET /bike-brands', () => {
    it('200 et marque avec ses modèles triés sans brandId', async () => {
      const agent = await loggedAgent();
      const res = await agent.get('/catalog/bike-brands').expect(200);
      const brands = res.body as Brand[];

      const brand = brands.find((b) => b.id === brandId);
      expect(brand).toEqual({
        id: brandId,
        name: `${REF} brand`,
        models: [
          { id: modelAId, name: `${REF} model A` },
          { id: modelBId, name: `${REF} model B` },
        ],
      });
    });
  });
});
