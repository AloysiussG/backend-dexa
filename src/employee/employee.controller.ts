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
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDtoRequest,
  ) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
