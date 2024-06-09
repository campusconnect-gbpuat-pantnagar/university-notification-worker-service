// job.module.ts
import { Module } from '@nestjs/common';
import {
  JobModel,
  JobModelProvider,
} from 'src/libraries/dal/models/jobs/job.schema';
import { JobService } from './job.service';
import { DalService } from 'src/libraries/dal/dal.service';

const jobDbService = {
  provide: 'JobDBService',
  useFactory: async () => {
    const service = new DalService();
    await service.connect(process.env.JOB_DB_URI, {}, 'jobDB');
    return service;
  },
};

const PROVIDERS = [jobDbService];
@Module({
  providers: [...PROVIDERS, JobModelProvider, JobModel, JobService],
  exports: [JobService, JobModel, JobModelProvider],
})
export class JobModule {}
