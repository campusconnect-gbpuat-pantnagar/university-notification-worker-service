import { InjectQueue } from '@nestjs/bullmq';
import { EmailQueues } from '../queue.constants';

export const InjectAuthNotificationQueue = () =>
  InjectQueue(EmailQueues.APP_NOTIFICATION);
export const InjectUniversityBulkNotificationQueue = () =>
  InjectQueue(EmailQueues.UNIVERSITY_NOTIFICATION_BULK);
