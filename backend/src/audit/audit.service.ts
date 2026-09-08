import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {

  async createAudit(data: any) {
    console.log('AUDIT:', data);

    return data;
  }

}