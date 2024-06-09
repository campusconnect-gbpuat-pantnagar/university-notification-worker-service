import { QueueEventJobPattern } from './job.pattern';

export interface JobCreatedJob {
  pattern: QueueEventJobPattern.JOB_CREATED;
  data: {
    jobId: string;
  };
}
export interface JobCreatedEmailJob {
  pattern: QueueEventJobPattern.JOB_CREATED_EMAIL_TO_USER;
  data: {
    email: string;
    firstName: string;
    jobLink: string;
    eligibility: string;
    workLocation: string;
    salary: string;
    lastDate: string;
    companyName: string;
    workTitle: string;
    skillsRequired: string[];
  };
}
