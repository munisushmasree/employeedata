import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Offboarding,
  OffboardingDocument,
} from './offboarding.schema';
import { AuditService } from '../audit/audit.service';
import { WorkflowService } from '../workflow/workflow.service';

@Injectable()
export class OffboardingService {
  constructor(
    @InjectModel(Offboarding.name)
    private offboardingModel: Model<OffboardingDocument>,
    private readonly auditService: AuditService,
    private readonly workflowService: WorkflowService,
  ) {}

  // Create offboarding
  async create(data: any) {
    const offboarding = new this.offboardingModel({
      ...data,

      // Initial overall status
      status: 'Pending',
      resignationDate: data.resignationDate || new Date().toISOString().slice(0, 10),

      // Initial approval status
      hrClearance: 'Pending',
      itClearance: 'Pending',
      financeClearance: 'Pending',
      managerApproval: 'Pending',
      approvalStages: this.workflowService.createStages(
        data.approvalChain || (await this.workflowService.getConfiguredChain()),
      ),
    });

    const saved = await offboarding.save();
    await this.auditService.createAudit({
      action: 'OFFBOARDING_CREATED',
      entity: 'offboarding',
      entityId: saved._id.toString(),
      userId: data.createdById || 'system',
      userName: data.createdByName || 'HR Admin',
      role: 'HR',
      remarks: 'Offboarding workflow initiated',
    });
    return saved;
  }

  // Get all offboarding records
  async findAll() {
    return this.offboardingModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async getWorkflowConfig() {
    return {
      name: 'Employee Offboarding Clearance',
      stages: await this.workflowService.getConfiguredChain(),
    };
  }

  async updateWorkflowConfig(stages: any[]) {
    return this.workflowService.saveConfiguredChain(stages);
  }

  async findRoleView(role: string) {
    const roleViews = {
      hr: {
        title: 'HR Overview',
        approvalField: 'hrClearance',
      },
      finance: {
        title: 'Finance View',
        approvalField: 'financeClearance',
      },
      it: {
        title: 'IT Overview',
        approvalField: 'itClearance',
      },
      manager: {
        title: 'Manager View',
        approvalField: 'managerApproval',
      },
    };

    const view = roleViews[role.toLowerCase()];

    if (!view) {
      throw new BadRequestException(
        'Role must be hr, finance, or manager',
      );
    }

    const records = await this.offboardingModel
      .find()
      .sort({ createdAt: -1 })
      .exec();

    const pending = records.filter((record) => {
      const stage = record.approvalStages?.find(
        (item) => item.role.toLowerCase() === role.toLowerCase(),
      );
      return stage ? stage.status !== 'Approved' : record[view.approvalField] !== 'Approved';
    }).length;

    return {
      role: role.toLowerCase(),
      title: view.title,
      approvalField: view.approvalField,
      summary: {
        total: records.length,
        pending,
        approved: records.length - pending,
      },
      records,
    };
  }

  // Get one offboarding record
  async findById(id: string) {
    return this.offboardingModel
      .findById(id)
      .exec();
  }

  async findAuditHistory(id: string) {
    return this.auditService.findByEntity('offboarding', id);
  }

  // Update approval and automatically update overall status
  async updateStatus(id: string, data: any) {
    // Find existing record
    const record =
      await this.offboardingModel.findById(id);

    if (!record) {
      throw new Error('Offboarding record not found');
    }

    const previousValues = {
      hrClearance: record.hrClearance,
      itClearance: record.itClearance,
      financeClearance: record.financeClearance,
      managerApproval: record.managerApproval,
    };

    // Update legacy approval fields for compatibility.
    if (data.hrClearance !== undefined) {
      record.hrClearance = data.hrClearance;
    }

    // Update IT clearance
    if (data.itClearance !== undefined) {
      record.itClearance = data.itClearance;
    }

    // Update Finance clearance
    if (data.financeClearance !== undefined) {
      record.financeClearance =
        data.financeClearance;
    }

    // Update Manager approval
    if (data.managerApproval !== undefined) {
      record.managerApproval =
        data.managerApproval;
    }

    if (data.stageKey && record.approvalStages?.length) {
      const stage = record.approvalStages.find(
        (item) => item.key === data.stageKey,
      );
      if (!stage) throw new BadRequestException('Workflow stage not found');
      const reopeningApprovedStage =
        data.status === 'Pending' && stage.status === 'Approved';
      if (
        stage.status !== 'Active' &&
        !reopeningApprovedStage &&
        data.status !== 'Rejected'
      ) {
        throw new BadRequestException('This workflow stage is not active');
      }

      stage.status = data.status || 'Approved';
      stage.remarks = data.remarks || '';
      stage.approvedBy = data.userName || 'HR Admin';
      stage.approvedByRole = data.role || stage.role;
      stage.approvedAt = new Date();
      this.workflowService.activateNextStages(record.approvalStages as any);

      const legacyField = {
        manager: 'managerApproval',
        'admin-systems': 'itClearance',
        accounts: 'financeClearance',
        hr: 'hrClearance',
      }[stage.key];
      if (legacyField) record[legacyField] = stage.status;
    }

    // Check whether ALL approvals are Approved
    const allApproved =
      record.hrClearance === 'Approved' &&
      record.itClearance === 'Approved' &&
      record.financeClearance === 'Approved' &&
      record.managerApproval === 'Approved';

    const workflowComplete = record.approvalStages?.length
      ? record.approvalStages.every((stage) => stage.status === 'Approved')
      : allApproved;

    if (workflowComplete) {
      record.status = 'Approved';
    } else {
      record.status = 'Pending';
    }

    const saved = await record.save();
    const changedField = Object.keys(previousValues).find(
      (field) => previousValues[field] !== saved[field],
    );
    await this.auditService.createAudit({
      action: data.status === 'Rejected' ? 'STAGE_REJECTED' : 'STAGE_UPDATED',
      entity: 'offboarding',
      entityId: id,
      userId: data.userId || 'system',
      userName: data.userName || 'HR Admin',
      role: data.role || 'HR',
      field: data.stageKey || changedField || 'workflow',
      from: changedField ? previousValues[changedField] : '',
      to: data.status || 'Approved',
      remarks: data.remarks || '',
    });
    return saved;
  }
}