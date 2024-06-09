import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JobCreatedEmailJob,
  JobCreatedJob,
  JobPriority,
  QueueEventJobPattern,
} from 'src/libraries/queues/jobs';
import { Job, Queue } from 'bullmq';
import { EmailQueues } from 'src/libraries/queues/queue.constants';
import { JobService } from 'src/app/job/job.service';
import { UserService } from 'src/app/user/user.service';
import { InjectUniversityBulkNotificationQueue } from 'src/libraries/queues/decorators/inject-queue.decorator';

@Processor(EmailQueues.UNIVERSITY_NOTIFICATION, {
  concurrency: 100,
  useWorkerThreads: true,
})
export class UniversityNotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(UniversityNotificationProcessor.name);
  constructor(
    private _configService: ConfigService,
    private _jobService: JobService,
    private _userService: UserService,
    @InjectUniversityBulkNotificationQueue()
    private _universityBulkNotificationQueue: Queue,
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
      const userLists = await this._userService.findTargetUserForJob(
        newCreatedJob.collegeId,
        newCreatedJob.batchYear,
      );
      for (const user of userLists) {
        const eventData: JobCreatedEmailJob['data'] = {
          email: user.gbpuatEmail,
          firstName: user.firstName,
          workTitle: newCreatedJob.workTitle,
          jobLink: newCreatedJob.link,
          eligibility: newCreatedJob.eligibility,
          companyName: newCreatedJob.company,
          workLocation: newCreatedJob.workLocation,
          lastDate: newCreatedJob.applyBy,
          salary: newCreatedJob.salary,
          skillsRequired: newCreatedJob.skillsReq,
        };

        await this._universityBulkNotificationQueue.add(
          QueueEventJobPattern.JOB_CREATED_EMAIL_TO_USER,
          { ...eventData },
          { priority: JobPriority.HIGHEST },
        );
      }
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
