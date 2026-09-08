import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  WorkflowConfig,
  WorkflowConfigDocument,
} from './workflow.schema';

export type WorkflowStageStatus =
  | 'Pending'
  | 'Active'
  | 'Approved'
  | 'Rejected';

export interface WorkflowStageInput {
  key: string;
  name: string;
  role: string;
  mode: 'parallel' | 'sequential';
  order: number;
  checklist: string[];
}

export interface WorkflowStage extends WorkflowStageInput {
  status: WorkflowStageStatus;
  remarks: string;
  approvedBy: string;
  approvedByRole: string;
  approvedAt?: Date;
}

@Injectable()
export class WorkflowService {
  constructor(
    @InjectModel(WorkflowConfig.name)
    private readonly workflowConfigModel: Model<WorkflowConfigDocument>,
  ) {}

  getDefaultChain(): WorkflowStageInput[] {
    return [
      {
        key: 'manager',
        name: 'Project / Reporting Manager',
        role: 'Manager',
        mode: 'parallel',
        order: 1,
        checklist: [
          'Project work completed',
          'Knowledge transfer completed',
          'Client and system access reviewed',
        ],
      },
      {
        key: 'admin-systems',
        name: 'Admin & Systems',
        role: 'IT',
        mode: 'parallel',
        order: 1,
        checklist: [
          'Laptop and accessories returned',
          'Email and system access revoked',
          'Keys and access cards returned',
        ],
      },
      {
        key: 'accounts',
        name: 'Accounts',
        role: 'Finance',
        mode: 'parallel',
        order: 1,
        checklist: [
          'Travel advances cleared',
          'Loans and salary advances cleared',
          'Imprest cleared',
        ],
      },
      {
        key: 'personnel',
        name: 'Personnel',
        role: 'Personnel',
        mode: 'parallel',
        order: 1,
        checklist: [
          'ID card returned',
          'Access card returned',
          'Business cards returned',
        ],
      },
      {
        key: 'hr',
        name: 'HR Final Clearance',
        role: 'HR',
        mode: 'sequential',
        order: 2,
        checklist: [
          'Final clearance reviewed',
          'Relieving documents prepared',
        ],
      },
    ];
  }

  createStages(chain = this.getDefaultChain()): WorkflowStage[] {
    const firstOrder = Math.min(...chain.map((stage) => stage.order));

    return chain.map((stage) => ({
      ...stage,
      status: stage.order === firstOrder ? 'Active' : 'Pending',
      remarks: '',
      approvedBy: '',
      approvedByRole: '',
    }));
  }

  async getConfiguredChain() {
    const config = await this.workflowConfigModel.findOne({ key: 'offboarding' });
    return (config?.stages?.length ? config.stages : this.getDefaultChain()) as WorkflowStageInput[];
  }

  async saveConfiguredChain(stages: WorkflowStageInput[]) {
    if (!Array.isArray(stages) || stages.length === 0) {
      throw new Error('At least one workflow stage is required');
    }

    return this.workflowConfigModel.findOneAndUpdate(
      { key: 'offboarding' },
      { key: 'offboarding', stages },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
  }

  activateNextStages(stages: WorkflowStage[]) {
    const activeOrder = Math.min(
      ...stages
        .filter((stage) => stage.status === 'Active')
        .map((stage) => stage.order),
      Infinity,
    );

    if (activeOrder !== Infinity) {
      const activeStages = stages.filter(
        (stage) => stage.order === activeOrder,
      );
      if (activeStages.some((stage) => stage.status !== 'Approved')) {
        return;
      }
    }

    const nextOrder = Math.min(
      ...stages
        .filter((stage) => stage.status === 'Pending')
        .map((stage) => stage.order),
      Infinity,
    );

    if (nextOrder !== Infinity) {
      stages.forEach((stage) => {
        if (stage.order === nextOrder) stage.status = 'Active';
      });
    }
  }
}