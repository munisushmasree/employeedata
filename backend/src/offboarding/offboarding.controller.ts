import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { OffboardingService } from './offboarding.service';

@Controller('offboarding')
export class OffboardingController {
  constructor(
    private readonly offboardingService: OffboardingService,
  ) {}

  // Create new offboarding
  @Post()
  async create(@Body() data: any) {
    return this.offboardingService.create(data);
  }

  // Get all offboarding records
  @Get()
  async findAll() {
    return this.offboardingService.findAll();
  }

  // Get the dynamic view for HR, Finance, or Manager
  @Get('view/:role')
  async findRoleView(@Param('role') role: string) {
    return this.offboardingService.findRoleView(role);
  }

  // Get one offboarding record
  @Get(':id')
  async findById(
    @Param('id') id: string,
  ) {
    return this.offboardingService.findById(id);
  }

  // Update clearance / approval
  @Patch(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.offboardingService.updateStatus(
      id,
      data,
    );
  }
}