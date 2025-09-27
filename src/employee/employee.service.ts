import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  CreateEmployeeDtoRequest,
  CreateEmployeeDtoResponse,
} from './dto/create-employee.dto';
import {
  UpdateEmployeeDtoRequest,
  UpdateEmployeeDtoResponse,
} from './dto/update-employee.dto';
import { ValidationService } from 'src/common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from 'src/common/prisma.service';
import { EmployeeValidation } from './employee.validation';
import { toUTC } from 'src/common/date.helper';
import bcrypt from 'bcrypt';
import { EmployeeDtoResponse } from './dto/get-employee.dto';

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

  async findAll(): Promise<EmployeeDtoResponse[]> {
    const employees = await this.prismaService.user.findMany();
    return employees.map((emp) => ({
      id: emp.id.toString(),
      name: emp.name,
      email: emp.email,
      role: emp.role,
      hiredDate: emp.hiredDate,
      updatedAt: emp.updatedAt,
    }));
  }

  async findOne(id: number): Promise<EmployeeDtoResponse> {
    const employee = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!employee) throw new HttpException('Employee not found', 404);

    return {
      id: employee.id.toString(),
      name: employee.name,
      email: employee.email,
      role: employee.role,
      hiredDate: employee.hiredDate,
      updatedAt: employee.updatedAt,
    };
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDtoRequest,
  ): Promise<UpdateEmployeeDtoResponse> {
    this.logger.info(
      `Update Employee ${id} - Data ${JSON.stringify(updateEmployeeDto)}`,
    );

    // validation
    const newData = this.validationService.validate<UpdateEmployeeDtoRequest>(
      EmployeeValidation.UPDATE_EMPLOYEE,
      updateEmployeeDto,
    );

    // find this employee by id
    const employee = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!employee) throw new HttpException('Employee not found', 404);

    // check email uniqueness if email is being updated
    if (newData.email && newData.email !== employee.email) {
      const existingEmailUser = await this.prismaService.user.findUnique({
        where: { email: newData.email },
      });

      if (existingEmailUser && existingEmailUser.id !== id) {
        throw new HttpException('Email already exists', 400);
      }
    }

    // optional: hash password if present
    if (newData?.password) {
      newData.password = await bcrypt.hash(newData.password, 10);
    }

    const updatedEmployee = await this.prismaService.user.update({
      where: { id },
      data: newData,
    });

    return {
      id: updatedEmployee.id.toString(),
      name: updatedEmployee.name,
      email: updatedEmployee.email,
    };
  }

  async remove(id: number): Promise<{ id: string }> {
    const employee = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!employee) throw new HttpException('Employee not found', 404);

    await this.prismaService.user.delete({ where: { id } });

    return { id: id.toString() };
  }
}
