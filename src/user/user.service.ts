import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/prisma.service';
import { AddEmployeeRequest, AddEmployeeResponse } from 'src/model/user.model';
import { ValidationService } from 'src/common/validation.service';
import { toUTC } from 'src/common/date.helper';

@Injectable()
export class UserService {
  /**
   *
   */
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async addEmployee(request: AddEmployeeRequest): Promise<AddEmployeeResponse> {
    this.logger.info(`Add Employee ${JSON.stringify(request)}`);

    // validation
    const addEmpRequest = this.validationService.validate<AddEmployeeRequest>(
      UserValidation.ADD_EMPLOYEE,
      request,
    );

    // check unique email
    const total = await this.prismaService.user.count({
      where: {
        email: addEmpRequest.email,
      },
    });

    if (total) {
      throw new HttpException('Email already exists', 400);
    }

    // hash password, complexity 10
    addEmpRequest.password = await bcrypt.hash(addEmpRequest.password, 10);

    // convert hiredDate string to UTC Date (consistency)
    addEmpRequest.hiredDate = toUTC(
      addEmpRequest.hiredDate as unknown as string,
    );

    // create employee / user
    const newEmp = await this.prismaService.user.create({
      data: addEmpRequest,
    });

    return {
      id: newEmp.id.toString(),
      name: newEmp.name,
    };
  }
}
