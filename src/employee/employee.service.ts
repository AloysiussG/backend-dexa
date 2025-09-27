import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  CreateEmployeeDtoRequest,
  CreateEmployeeDtoResponse,
} from './dto/create-employee.dto';
import { UpdateEmployeeDtoRequest } from './dto/update-employee.dto';
import { ValidationService } from 'src/common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from 'src/common/prisma.service';
import { EmployeeValidation } from './employee.validation';
import { toUTC } from 'src/common/date.helper';
import bcrypt from 'bcrypt';

@Injectable()
export class EmployeeService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDtoRequest,
  ): Promise<CreateEmployeeDtoResponse> {
    this.logger.info(`Create Employee ${JSON.stringify(createEmployeeDto)}`);

    // validation
    const addEmpRequest =
      this.validationService.validate<CreateEmployeeDtoRequest>(
        EmployeeValidation.CREATE_EMPLOYEE,
        createEmployeeDto,
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

  findAll() {
    return `This action returns all employee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDtoRequest) {
    return `This action updates a #${updateEmployeeDto.email} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
