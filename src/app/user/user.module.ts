// job.module.ts
import { Module } from '@nestjs/common';
import { DalService } from 'src/libraries/dal/dal.service';
import {
  userModel,
  UserModelProvider,
} from 'src/libraries/dal/models/user/user.schema';
import { UserService } from './user.service';

const userDbService = {
  provide: 'UserDBService',
  useFactory: async () => {
    const service = new DalService();
    await service.connect(process.env.USER_DB_URI, {}, 'userDB');
    return service;
  },
};

const PROVIDERS = [userDbService];
@Module({
  providers: [...PROVIDERS, UserModelProvider, userModel, UserService],
  exports: [UserService, userModel, UserModelProvider],
})
export class UserModule {}
