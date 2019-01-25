import { Avatar } from './core-models';

export interface ProfileUser {
  _id: string;
  avatar: Avatar;
  name: string;
  images: ProfileImage[];
  username: string;
  unityId: string;
  campusId: string;
  jobTitle: string;
  department: string;
  dates: { created: Date; updated: Date };
  contact: UserProfileContact;
  organization: UserProfileOrganization;
  employment: UserProfileEmployment[];
  directReports: UserProfileDirectReport[];
  ccure: UserProfileCcure;
  studentProfiles: UserProfileStudentProfile[];
  wolfOne: UserProfileWolfOne;
  housing: UserProfileHousing;
}

export interface UserProfileContact {
  phone: { value: string; label?: string }[];
  emails: { value: string; label?: string }[];
}

export interface UserProfileOrganization {
  name: string;
  ou: { name: string; code: string };
}

export interface UserProfileEmployment {
  iteration: number;
  active: boolean;
  fte: number;
  dateRange: string;
  supervisor: { id: string; name: string; avatar: string, campusId: string };
  details: { name: string; value: any }[];
}

export interface UserProfileDirectReport {
  id: string;
  name: string;
  avatar: string;
  campusId: string;
  active: boolean;
}

export interface UserProfileCcure {
  cidc: string;
  disabled: boolean;
  credentials: UserProfileCcureCredential[];
}

export interface UserProfileCcureCredential {
  cardNumber: number;
  cardInt1: number;
  cardInt2: number;
  cardInt3: number;
  cardInt4: number;
  active: boolean;
  disabled: boolean;
  enabled: boolean;
  expired: boolean;
  lost: boolean;
  stolen: boolean;
  template: boolean;
  updated: string;
}

export interface UserProfileStudentProfile {
  level: string;
  enrolled: boolean;
  registeredDate: string;
}

export interface UserProfileWolfOne {
  patron: { patronId: number };
  credentials: {
    value: string;
    history: {
      date: string;
      modificationType: string;
    }[];
  }[];
}

export interface UserProfileHousing {
  semesterTerm: string;
  buildingCode: string;
  unitBed: string;
  unitNumber: string;
  unitSuffix: string;
  staffedInBuilding: boolean;
}

export interface ProfileImage {
  md5: string;
  name: string;
}
