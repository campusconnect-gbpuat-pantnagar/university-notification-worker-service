import { Inject, Injectable } from '@nestjs/common';
import { IJobDoc, IJobModel } from 'src/libraries/dal/models/jobs/job.entity';

@Injectable()
export class JobService {
  constructor(@Inject('JobModel') private readonly jobModel: IJobModel) {}

  async findJobById(jobId: string): Promise<IJobDoc> {
    return this.jobModel.findById(jobId).exec();
  }
}
