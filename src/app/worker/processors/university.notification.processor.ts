import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JobCreatedJob, QueueEventJobPattern } from 'src/libraries/queues/jobs';
import { Job } from 'bullmq';
import { EmailQueues } from 'src/libraries/queues/queue.constants';
import { JobService } from 'src/app/job/job.service';

@Processor(EmailQueues.UNIVERSITY_NOTIFICATION, {
  concurrency: 100,
  useWorkerThreads: true,
})
export class UniversityNotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(UniversityNotificationProcessor.name);
  constructor(
    private _configService: ConfigService,
    private _jobService: JobService,
  ) {
    super();
  }
  async process(
    job: Job<JobCreatedJob['data'], number, string>,
  ): Promise<void> {
    try {
      switch (job.name) {
        case QueueEventJobPattern.JOB_CREATED:
          await this.newJobCreatedHandler(job);
          break;
        default:
          break;
      }
    } catch (error) {
      this.logger.error(
        `Failed to process job ${job.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async newJobCreatedHandler(job: Job<JobCreatedJob['data']>) {
    const { jobId } = job.data;
    this.logger.debug('new job created', jobId);
    try {
      const newCreatedJob = await this._jobService.findJobById(jobId);
      this.logger.debug(newCreatedJob);
    } catch (error) {
      this.logger.error(
        `Error checking post content for job ${job.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<JobCreatedJob['data']>) {
    const { id, name, queueName, finishedOn } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';

    this.logger.log(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}.`,
    );
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    const { id, name, progress } = job;
    this.logger.log(`Job id: ${id}, name: ${name} completes ${progress}%`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    const { id, name, queueName, timestamp } = job;
    const startTime = timestamp ? new Date(timestamp).toISOString() : '';
    this.logger.log(
      `Job id: ${id}, name: ${name} starts in queue ${queueName} on ${startTime}.`,
    );
  }
}
