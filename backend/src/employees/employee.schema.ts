import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmployeeDocument = HydratedDocument<Employee>;

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  employeeId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  department: string;

  @Prop({ default: 'Active' })
  status: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
