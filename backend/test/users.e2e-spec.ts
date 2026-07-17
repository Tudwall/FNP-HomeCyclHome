import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from 'src/configure-app';
import { PrismaService } from 'prisma/prisma.service';

describe('Users & Auth (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let prisma: PrismaService;

  const password = 'password123';
  const loginEmail = 'e2e-login@test.fr';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
    server = app.getHttpServer();

    prisma = app.get(PrismaService);
    await prisma.appUser.deleteMany({ where: { email: { contains: 'e2e-' } } });

    await request(server)
      .post('/auth/signup')
      .send({ email: loginEmail, password, firstName: 'Log', lastName: 'In' })
      .expect(201);
  });

  afterAll(async () => {
    await prisma.appUser.deleteMany({ where: { email: { contains: 'e2e-' } } });
    await app.close();
  });

  async function authAgent() {
    const agent = request.agent(server);
    await agent
      .post('/auth/login')
      .send({ email: loginEmail, password })
      .expect(200);
    return agent;
  }

  describe('POST /auth/signup', () => {
    it('201 + renvoie {id, email} sans pwd', async () => {
      const res = await request(server)
        .post('/auth/signup')
        .send({
          email: 'e2e-new@test.fr',
          password,
          firstName: 'A',
          lastName: 'B',
        })
        .expect(201);
      expect(res.body).toEqual({
        id: expect.any(Number),
        email: 'e2e-new@test.fr',
      });
      expect(res.body).not.toHaveProperty('password');
    });

    it('email déjà pris -> 409', async () => {
      await request(server)
        .post('/auth/signup')
        .send({ email: loginEmail, password, firstName: 'A', lastName: 'B' })
        .expect(409);
    });

    it('body invalide -> 400', async () => {
      await request(server)
        .post('/auth/signup')
        .send({ email: 'not-an-email', password: 'short' })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('mauvais pwd -> 401', async () => {
      await request(server)
        .post('/auth/login')
        .send({ email: loginEmail, password: 'wrongpass' })
        .expect(401);
    });

    it('OK -> 200 + cookie httpOnly, ni token, ni pwd dans le body', async () => {
      const res = await request(server)
        .post('/auth/login')
        .send({ email: loginEmail, password })
        .expect(200);

      const cookies = res.headers['set-cookie'] as unknown as string[];
      expect(
        cookies.some((c) => /access_token/.test(c) && /HttpOnly/i.test(c)),
      ).toBe(true);
      expect(res.body).not.toHaveProperty('accessToken');
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({ id: expect.any(Number), email: loginEmail });
    });
  });

  describe('GET /users', () => {
    it('sans cookie -> 401', async () => {
      await request(server).get('/users').expect(401);
    });

    it('avec cookie -> 200 et aucun password dans les items', async () => {
      const agent = await authAgent();
      const res = await agent.get('/users').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      for (const u of res.body) expect(u).not.toHaveProperty('password');
    });
  });

  describe('GET /users/:id', () => {
    it('id non numérique -> 400 (ParseIntPipe)', async () => {
      const agent = await authAgent();
      await agent.get('/users/abc').expect(400);
    });
  });

  describe('PATCH / DELETE /users/:id (soft-delete)', () => {
    it('cycle PATCH ok -> champ interdit 400 -> DELETE -> re-DELETE/PATCH 404', async () => {
      const agent = await authAgent();

      const created = await request(server)
        .post('/auth/signup')
        .send({
          email: 'e2e-target@test.fr',
          password,
          firstName: 'T',
          lastName: 'G',
        })
        .expect(201);
      const id = created.body.id as number;

      await agent
        .patch(`/users/${id}`)
        .send({ firstName: 'Updated' })
        .expect(200);

      await agent
        .patch(`/users/${id}`)
        .send({ password: 'newpassword' })
        .expect(400);

      await agent.delete(`/users/${id}`).expect(200);
      await agent.delete(`/users/${id}`).expect(404);
      await agent.patch(`/users/${id}`).send({ firstName: 'X' }).expect(404);
    });

    it('PATCH id inexistant → 404', async () => {
      const agent = await authAgent();
      await agent.patch('/users/99999999').send({ firstName: 'X' }).expect(404);
    });
  });
});
