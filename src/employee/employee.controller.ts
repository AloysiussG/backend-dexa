import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import {
  CreateEmployeeDtoRequest,
  CreateEmployeeDtoResponse,
} from './dto/create-employee.dto';
import { WebResponse } from 'src/model/web.dto';
import { UpdateEmployeeDtoRequest } from './dto/update-employee.dto';
import { EmployeeDtoResponse } from './dto/get-employee.dto';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';

@UseGuards(RolesGuard)
@Controller('/api/employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @Roles('HR') // only HR can access
  @HttpCode(200)
  async create(
    @Body() createEmployeeDto: CreateEmployeeDtoRequest,
  ): Promise<WebResponse<CreateEmployeeDtoResponse>> {
    const result = await this.employeeService.create(createEmployeeDto);
    return {
      data: result,
      message: 'Employee successfully created.',
    };
  }

  @Get()
  @Roles('HR')
  async findAll(): Promise<WebResponse<EmployeeDtoResponse[]>> {
    const result = await this.employeeService.findAll();
    return { data: result, message: 'All employees retrieved successfully.' };
  }

  @Get(':id')
  @Roles('HR')
  async findOne(
    @Param('id') id: string,
  ): Promise<WebResponse<EmployeeDtoResponse>> {
    const result = await this.employeeService.findOne(+id);
    return { data: result, message: 'Employee retrieved successfully.' };
  }

  @Patch(':id')
  @Roles('HR')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDtoRequest,
  ): Promise<WebResponse<CreateEmployeeDtoResponse>> {
    const result = await this.employeeService.update(+id, updateEmployeeDto);
    return {
      data: result,
      message: 'Employee updated successfully.',
    };
  }

  @Delete(':id')
  @Roles('HR')
  async remove(@Param('id') id: string): Promise<WebResponse<{ id: string }>> {
    const result = await this.employeeService.remove(+id);
    return { data: result, message: 'Employee deleted successfully.' };
  }
}
