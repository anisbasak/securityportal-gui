import {
  ProfileUser,
  UserProfileContact,
  UserProfileOrganization,
  UserProfileEmployment,
  UserProfileDirectReport,
  UserProfileWolfOne,
  UserProfileCcure,
  UserProfileCcureCredential,
  UserProfileStudentProfile,
  UserProfileHousing,
} from '@app/core/models';

export interface LookupResults {
  users: UserLookupResponse[];
}

export interface UserLookupResponse {
  _id: string;
  name: string;
  avatar: string;
}

export type User = ProfileUser;
export type UserContact = UserProfileContact;
export type UserOrganization = UserProfileOrganization;
export type UserEmployment = UserProfileEmployment;
export type UserDirectReport = UserProfileDirectReport;
export type UserWolfOne = UserProfileWolfOne;
export type UserCcure = UserProfileCcure;
export type UserCcureCredential = UserProfileCcureCredential;
export type UserStudentProfile = UserProfileStudentProfile;
export type UserHousing = UserProfileHousing;
