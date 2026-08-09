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
  const otherEmail = 'e2e-other@test.fr';

  let loginId: number;
  let otherId: number;

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

    loginId = await signup(loginEmail);
    otherId = await signup(otherEmail);
  });

  afterAll(async () => {
    await prisma.appUser.deleteMany({ where: { email: { contains: 'e2e-' } } });
    await app.close();
  });

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

  describe('GET /auth/me', () => {
    it('sans cookie -> 401', async () => {
      await request(server).get('/auth/me').expect(401);
    });

    it('avec cookie -> 200 sans password', async () => {
      const agent = await agentFor(loginEmail);
      const res = await agent.get('/auth/me').expect(200);
      expect(res.body).toMatchObject({ id: loginId, email: loginEmail });
      expect(res.body).not.toHaveProperty('password');
    });
  });

  describe('GET /users (annuaire retiré tant qu’il n’y a pas de RBAC)', () => {
    it('la route n’existe plus -> 404', async () => {
      const agent = await agentFor(loginEmail);
      await agent.get('/users').expect(404);
    });
  });

  describe('GET /users/:id', () => {
    it('sans cookie -> 401', async () => {
      await request(server).get(`/users/${loginId}`).expect(401);
    });

    it('son propre compte -> 200 sans password', async () => {
      const agent = await agentFor(loginEmail);
      const res = await agent.get(`/users/${loginId}`).expect(200);
      expect(res.body).not.toHaveProperty('password');
    });

    it('le compte d’autrui -> 403', async () => {
      const agent = await agentFor(loginEmail);
      await agent.get(`/users/${otherId}`).expect(403);
    });

    it('id non numérique -> 400 (ParseIntPipe)', async () => {
      const agent = await agentFor(loginEmail);
      await agent.get('/users/abc').expect(400);
    });
  });

  describe('PATCH / DELETE sur le compte d’autrui', () => {
    it('PATCH -> 403', async () => {
      const agent = await agentFor(loginEmail);
      await agent
        .patch(`/users/${otherId}`)
        .send({ firstName: 'Pirate' })
        .expect(403);
    });

    it('DELETE -> 403', async () => {
      const agent = await agentFor(loginEmail);
      await agent.delete(`/users/${otherId}`).expect(403);
    });
  });

  describe('Cycle sur son propre compte (soft-delete)', () => {
    it('PATCH ok -> champ interdit 400 -> DELETE -> re-DELETE/PATCH 404', async () => {
      const email = 'e2e-cycle@test.fr';
      const id = await signup(email);
      const agent = await agentFor(email);

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

    it('un compte soft-supprimé ne peut plus se connecter', async () => {
      const email = 'e2e-deleted@test.fr';
      const id = await signup(email);
      const agent = await agentFor(email);
      await agent.delete(`/users/${id}`).expect(200);

      await request(server)
        .post('/auth/login')
        .send({ email, password })
        .expect(401);
    });
  });
});
