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

@Injectable()
export class OffboardingService {
  constructor(
    @InjectModel(Offboarding.name)
    private offboardingModel: Model<OffboardingDocument>,
  ) {}

  // Create offboarding
  async create(data: any) {
    const offboarding = new this.offboardingModel({
      ...data,

      // Initial overall status
      status: 'Pending',

      // Initial approval status
      hrClearance: 'Pending',
      itClearance: 'Pending',
      financeClearance: 'Pending',
      managerApproval: 'Pending',
    });

    return offboarding.save();
  }

  // Get all offboarding records
  async findAll() {
    return this.offboardingModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
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

    const pending = records.filter(
      (record) => record[view.approvalField] !== 'Approved',
    ).length;

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

  // Update approval and automatically update overall status
  async updateStatus(id: string, data: any) {
    // Find existing record
    const record =
      await this.offboardingModel.findById(id);

    if (!record) {
      throw new Error('Offboarding record not found');
    }

    // Update HR clearance
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

    // Show current approval values in terminal
    console.log('HR:', record.hrClearance);
    console.log('IT:', record.itClearance);
    console.log('Finance:', record.financeClearance);
    console.log('Manager:', record.managerApproval);

    // Check whether ALL approvals are Approved
    const allApproved =
      record.hrClearance === 'Approved' &&
      record.itClearance === 'Approved' &&
      record.financeClearance === 'Approved' &&
      record.managerApproval === 'Approved';

    console.log('All Approved:', allApproved);

    // Automatically update overall status
    if (allApproved) {
      record.status = 'Approved';
    } else {
      record.status = 'Pending';
    }

    console.log('Final Status:', record.status);

    // Save changes to MongoDB
    return record.save();
  }
}