import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OffboardingController } from './offboarding.controller';
import { OffboardingService } from './offboarding.service';
import { AuditModule } from '../audit/audit.module';
import { WorkflowService } from '../workflow/workflow.service';
import {
  WorkflowConfig,
  WorkflowConfigSchema,
} from '../workflow/workflow.schema';

import {
  Offboarding,
  OffboardingSchema,
} from './offboarding.schema';

@Module({
  imports: [
    AuditModule,
    MongooseModule.forFeature([
      {
        name: Offboarding.name,
        schema: OffboardingSchema,
      },
      {
        name: WorkflowConfig.name,
        schema: WorkflowConfigSchema,
      },
    ]),
  ],

  controllers: [OffboardingController],
  providers: [OffboardingService, WorkflowService],

  exports: [OffboardingService],
})
export class OffboardingModule {}
