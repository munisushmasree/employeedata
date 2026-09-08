import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
  ) {}

  @Post()
  async create(@Body() data: any) {
    return this.employeeService.create(data);
  }

  @Get()
  async findAll() {
    return this.employeeService.findAll();
  }

  @Get(':employeeId')
  async findByEmployeeId(
    @Param('employeeId') employeeId: string,
  ) {
    return this.employeeService.findByEmployeeId(
      employeeId,
    );
  }
}