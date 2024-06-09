import mongoose from 'mongoose';
import { IUserDoc, IUserModel } from './user.entity';
import toJSON from '../plugins/toJSON';
import { Inject, Injectable } from '@nestjs/common';
import { DalService } from '../../dal.service';

const userSchema = new mongoose.Schema<IUserDoc, IUserModel>(
  {
    gbpuatId: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
      unique: true,
    },
    gbpuatEmail: {
      unique: true,
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      private: true, // used by the toJSON plugin
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },

    isTemporaryBlocked: {
      type: Boolean,
      required: true,
      default: false,
    },

    isPermanentBlocked: {
      type: Boolean,
      required: true,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    accountDeletionReason: {
      type: String,
      default: null,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      trim: true,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
      private: true, // used by the toJSON plugin
    },
    failedLogin: {
      times: {
        type: Number,
      },
      lastFailedAttempt: {
        type: Date,
      },
    },

    academicDetails: {
      college: {
        name: {
          type: String,
          required: true,
        },
        collegeId: {
          type: String,
          required: true,
        },
      },
      department: {
        name: {
          type: String,
          required: true,
        },
        departmentId: {
          type: String,
          required: true,
        },
      },
      degreeProgram: {
        name: {
          type: String,
          required: true,
        },
        degreeProgramId: {
          type: String,
          required: true,
        },
      },
      batchYear: Number,
      designation: String,
    },
    showOnBoardingTour: {
      type: Number,
      default: 0,
    },
    showOnBoarding: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin', 'moderator'],
      required: true,
      default: 'student',
    },
    receivedConnections: [
      {
        _id: false,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    sentConnections: [
      {
        _id: false,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    connectionLists: [
      {
        _id: false,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

@Injectable()
export class UserModelProvider {
  constructor(
    @Inject('UserDBService') private readonly dalService: DalService,
  ) {}

  getModel(): IUserModel {
    const connection: mongoose.Connection =
      this.dalService.getConnection('userDB');
    return connection.model<IUserDoc, IUserModel>('User', userSchema);
  }
}

export const userModel = {
  provide: 'userModel',
  useFactory: (userModelProvider: UserModelProvider) =>
    userModelProvider.getModel(),
  inject: [UserModelProvider],
};
