import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AzureADE2EStrategy } from '../src/application/auth/guards/azure-ad-strategy.e2e';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard())
      .useValue(new AzureADE2EStrategy())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1/users (POST) should create a user', async () => {
    return request(app.getHttpServer())
      .post('/v1/users')
      .send({ username: 'johndoe', email: 'john@doe.com' })
      .expect(201);
  });

  it('/v1/users (GET) should return all users', async () => {
    return request(app.getHttpServer())
      .get('/v1/users')
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBeGreaterThan(0);
      });
  });

  let userId: number;

  it('/v1/users/:id (GET) should return a user', async () => {
    userId = 3; // Set this to the actual ID
    return request(app.getHttpServer())
      .get(`/v1/users/${userId}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id', userId);
      });
  });

  it('/v1/users/:id (PUT) should update a user', () => {
    return request(app.getHttpServer())
      .put(`/v1/users/${userId}`)
      .send({ username: 'johndoe', email: 'john@doe.com' })
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('username', 'johndoe');
      });
  });

  it('/v1/users/:id (DELETE) should delete a user', () => {
    return request(app.getHttpServer())
      .delete(`/v1/users/${userId}`)
      .expect(200);
  });
});
