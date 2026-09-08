import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Audit, AuditDocument } from './audit.schema';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(Audit.name)
    private readonly auditModel: Model<AuditDocument>,
  ) {}

  async createAudit(data: any) {
    return this.auditModel.create(data);
  }

  async findByEntity(entity: string, entityId: string) {
    return this.auditModel
      .find({ entity, entityId })
      .sort({ createdAt: -1 })
      .exec();
  }

}