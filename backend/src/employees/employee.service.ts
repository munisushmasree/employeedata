import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Employee,
  EmployeeDocument,
} from './employee.schema';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name)
    private employeeModel: Model<EmployeeDocument>,
  ) {}

  async create(data: any) {
    const employee = new this.employeeModel(data);

    return employee.save();
  }

  async findAll() {
    return this.employeeModel.find().exec();
  }

  async findByEmployeeId(employeeId: string) {
    return this.employeeModel
      .findOne({ employeeId })
      .exec();
  }
}
