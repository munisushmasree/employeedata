import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OffboardingDocument =
  HydratedDocument<Offboarding>;

@Schema({ timestamps: true })
export class Offboarding {
  @Prop({ required: true })
  employeeId: string;

  @Prop({ required: true })
  employeeName: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  lastWorkingDay: string;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop({ default: 'Pending' })
  hrClearance: string;

  @Prop({ default: 'Pending' })
  itClearance: string;

  @Prop({ default: 'Pending' })
  financeClearance: string;

  @Prop({ default: 'Pending' })
  managerApproval: string;
}

export const OffboardingSchema =
  SchemaFactory.createForClass(Offboarding);