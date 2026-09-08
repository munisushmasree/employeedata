import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WorkflowConfigDocument = HydratedDocument<WorkflowConfig>;

@Schema({ timestamps: true })
export class WorkflowConfig {
  @Prop({ required: true, unique: true, default: 'offboarding' })
  key: string;

  @Prop({ type: [Object], default: [] })
  stages: Record<string, any>[];
}

export const WorkflowConfigSchema =
  SchemaFactory.createForClass(WorkflowConfig);