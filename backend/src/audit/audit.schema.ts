
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuditDocument =
  HydratedDocument<Audit>;

@Schema({ timestamps: true })
export class Audit {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  entity: string;

  @Prop({ required: true })
  entityId: string;

  @Prop()
  userId: string;

  @Prop()
  userName: string;

  @Prop()
  role: string;

  @Prop()
  field: string;

  @Prop()
  from: string;

  @Prop()
  to: string;

  @Prop()
  remarks: string;
}

export const AuditSchema =
  SchemaFactory.createForClass(Audit);
