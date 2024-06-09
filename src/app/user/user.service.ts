import { Inject, Injectable } from '@nestjs/common';
import {
  IUserDoc,
  IUserModel,
} from 'src/libraries/dal/models/user/user.entity';

@Injectable()
export class UserService {
  constructor(@Inject('userModel') private readonly userModel: IUserModel) {}

  async findTargetUserForJob(
    collegeId: string,
    batchYear: number,
  ): Promise<IUserDoc[]> {
    return this.userModel
      .find({
        'academicDetails.college.collegeId': collegeId,
        'academicDetails.batchYear': batchYear,
        isEmailVerified: true,
        isPermanentBlocked: false,
        isDeleted: false,
        role: 'student',
      })
      .exec();
  }
}
