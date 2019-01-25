import { DataType } from '@app/core/models';

export interface LookupKey {
  title: string;
  description: string;
  key: string;
  dataType: DataType;
  validations: ValidationConfig[];
}

export interface LookupKeysForLink {
  blueprint: string;
  keys: LookupKey[];
}

export interface LookupKeysResponse {
  keys: LookupKey[];
  links: LookupKeysForLink[];
}

export interface ValidationConfig {
  name: string;
  description: string;
  validations: Validation[];
}

export interface Validation {
  pattern: string;
  info: string;
  failOnMatch: boolean;
}
