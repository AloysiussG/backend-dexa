import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { App } from 'supertest/types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { WebResponse } from 'src/model/web.dto';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { CreateEmployeeDtoResponse } from 'src/employee/dto/create-employee.dto';

describe('EmployeeController', () => {
  let app: INestApplication<App>;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/employees', () => {
    beforeEach(async () => {
      await testService.deleteEmployee();
    });

    it('should be rejected if request invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/employees')
        .send({
          email: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect((response.body as { errors?: unknown }).errors).toBeDefined();
    });

    it('should be able to add employee', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/employees')
        .send({
          name: 'John Doe',
          email: 'johndoe@gmail.com',
          password: 'johndoe',
          role: 'Employee',
          hiredDate: '2025-09-25',
        });

      logger.info(response.body);

      const { data } = response.body as WebResponse<CreateEmployeeDtoResponse>;

      expect(response.status).toBe(200);
      expect(data.id).toBeDefined();
      expect(data.name).toBe('John Doe');
    });

    it('should be rejected to add employee because the same employee already added', async () => {
      // create first
      await testService.addEmployee();
      const response = await request(app.getHttpServer())
        .post('/api/employees')
        .send({
          name: 'John Doe',
          email: 'johndoe@gmail.com',
          password: 'johndoe',
          role: 'Employee',
          hiredDate: '2025-09-25',
        });

      logger.info(response.body);

      const body = response.body as WebResponse<CreateEmployeeDtoResponse>;

      expect(response.status).toBe(400);
      expect(body.errors).toBeDefined();
    });
  });
});
