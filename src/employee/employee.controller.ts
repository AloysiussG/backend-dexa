import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import {
  CreateEmployeeDtoRequest,
  CreateEmployeeDtoResponse,
} from './dto/create-employee.dto';
import { WebResponse } from 'src/model/web.dto';
import { UpdateEmployeeDtoRequest } from './dto/update-employee.dto';
import { EmployeeDtoResponse } from './dto/get-employee.dto';

@Controller('/api/employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Body() createEmployeeDto: CreateEmployeeDtoRequest,
  ): Promise<WebResponse<CreateEmployeeDtoResponse>> {
    const result = await this.employeeService.create(createEmployeeDto);
    return {
      data: result,
    };
  }

  @Get()
  async findAll(): Promise<WebResponse<EmployeeDtoResponse[]>> {
    const result = await this.employeeService.findAll();
    return { data: result };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<WebResponse<EmployeeDtoResponse>> {
    const result = await this.employeeService.findOne(+id);
    return { data: result };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDtoRequest,
  ): Promise<WebResponse<CreateEmployeeDtoResponse>> {
    const result = await this.employeeService.update(+id, updateEmployeeDto);
    return { data: result };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<WebResponse<{ id: string }>> {
    const result = await this.employeeService.remove(+id);
    return { data: result };
  }
}
