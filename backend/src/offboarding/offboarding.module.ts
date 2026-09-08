import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OffboardingController } from './offboarding.controller';
import { OffboardingService } from './offboarding.service';

import {
  Offboarding,
  OffboardingSchema,
} from './offboarding.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Offboarding.name,
        schema: OffboardingSchema,
      },
    ]),
  ],

  controllers: [OffboardingController],
  providers: [OffboardingService],

  exports: [OffboardingService],
})
export class OffboardingModule {}
