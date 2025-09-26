import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { App } from 'supertest/types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { WebResponse } from 'src/model/web.model';
import { AddEmployeeResponse } from 'src/model/user.model';

describe('UserController', () => {
  let app: INestApplication<App>;
  let logger: Logger;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
  });

  describe('POST /api/users', () => {
    it('should be rejected if request invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          email: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect((response.body as { errors?: unknown }).errors).toBeDefined();
    });

    it('should be able to add employee', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'John Doe',
          email: 'johndoe@gmail.com',
          password: 'johndoe',
          role: 'Employee',
          hiredDate: '2025-09-25',
        });

      logger.info(response.body);

      const { data } = response.body as WebResponse<AddEmployeeResponse>;

      expect(response.status).toBe(200);
      expect(data.id).toBeDefined();
      expect(data.name).toBe('John Doe');
    });
  });
});
