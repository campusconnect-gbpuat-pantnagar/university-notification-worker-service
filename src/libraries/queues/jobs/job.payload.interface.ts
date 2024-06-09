import { QueueEventJobPattern } from './job.pattern';

export interface JobCreatedJob {
  pattern: QueueEventJobPattern.POST_CREATED;
  data: {
    jobId: string;
  };
}
