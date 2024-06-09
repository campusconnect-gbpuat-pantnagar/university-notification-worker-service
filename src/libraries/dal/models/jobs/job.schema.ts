import * as mongoose from 'mongoose';
import toJSON from '../plugins/toJSON';
import { IJobDoc, IJobModel } from './job.entity';
import { Inject, Injectable } from '@nestjs/common';
import { DalService } from '../../dal.service';

const jobSchema = new mongoose.Schema<IJobDoc, IJobModel>(
  {
    workTitle: {
      type: String,
      required: true,
      trim: true,
      max: 50,
    },
    company: {
      type: String,
      required: true,
    },
    batchYear: {
      type: Number,
      required: true,
    },
    collegeId: {
      type: String,
      required: true,
    },

    eligibility: {
      type: String,
      required: true,
    },

    skillsReq: [
      {
        type: String,
        required: true,
      },
    ],

    workLocation: {
      type: String,
      required: true,
    },

    salary: {
      type: String,
    },

    applyBy: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

jobSchema.plugin(toJSON);

@Injectable()
export class JobModelProvider {
  constructor(
    @Inject('JobDBService') private readonly dalService: DalService,
  ) {}

  getModel(): IJobModel {
    const connection: mongoose.Connection =
      this.dalService.getConnection('jobDB');
    return connection.model<IJobDoc, IJobModel>('Job', jobSchema);
  }
}

export const JobModel = {
  provide: 'JobModel',
  useFactory: (jobModelProvider: JobModelProvider) =>
    jobModelProvider.getModel(),
  inject: [JobModelProvider],
};

// const Job = mongoose.model<IJobDoc, IJobModel>('Job', jobSchema);
// export default Job;
