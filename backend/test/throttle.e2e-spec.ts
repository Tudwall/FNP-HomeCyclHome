import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getOptionsToken } from '@nestjs/throttler';
import request from 'supertest';
import { PrismaService } from 'prisma/prisma.service';
import { AppModule } from 'src/app.module';
import { configureApp } from 'src/configure-app';
import { App } from 'supertest/types';

describe('Throttle e2e', () => {
  let app: INestApplication;
  let server: App;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getOptionsToken())
      .useValue({ throttlers: [{ ttl: 60_000, limit: 5 }] })
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
    server = app.getHttpServer();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.appUser.deleteMany({
      where: { email: { contains: 'e2e-throttle' } },
    });
    await app.close();
  });

  it('POST /auth/signup: 6ème requête dans la minute -> 429', async () => {
    for (let i = 0; i < 5; i++) {
      await request(server)
        .post('/auth/signup')
        .send({ email: 'not-an-email' })
        .expect(400);
    }

    const res = await request(server)
      .post('/auth/signup')
      .send({
        email: 'e2e-throttle@test.fr',
        password: 'password123',
        firstName: 'A',
        lastName: 'B',
      })
      .expect(429);

    expect(res.headers['retry-after']).toBeDefined();
  });
});
