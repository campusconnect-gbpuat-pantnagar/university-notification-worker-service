import { Document, Model } from 'mongoose';

export interface IJob {
  workTitle: string;
  company: string;
  batchYear: number;
  collegeId: string;
  eligibility: string;
  skillsReq: string[];
  workLocation: string;
  salary: string;
  applyBy: string;
  link: string;
}

export interface IJobDoc extends IJob, Document {}

export interface IJobModel extends Model<IJobDoc> {}
