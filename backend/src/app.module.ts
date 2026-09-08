import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employee.module';
import { OffboardingModule } from './offboarding/offboarding.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb://127.0.0.1:27017/employee_offboarding',
    ),

    AuthModule,
    EmployeesModule,
    OffboardingModule,
  ],
})
export class AppModule {}
