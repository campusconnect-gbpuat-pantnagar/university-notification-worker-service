import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckController } from './healthcheck/healthcheck.controller';
import { WorkerModule } from './worker/worker.module';
import { JobModule } from './job/job.module';
import { UserModule } from './user/user.module';

// const jobDbService = {
//   provide: 'JobDBService',
//   useFactory: async () => {
//     const service = new DalService();
//     await service.connect(process.env.JOB_DB_URI, {}, 'jobDB');
//     return service;
//   },
// };

// const userDbService = {
//   provide: 'UserDBService',
//   useFactory: async () => {
//     const service = new DalService();
//     await service.connect(process.env.USER_DB_URI, {}, 'userDB');
//     return service;
//   },
// };

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WorkerModule,
    JobModule,
    UserModule,
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class AppModule {}
