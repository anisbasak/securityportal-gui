export interface UserLookupFormState {
  general?: string;
  user: LookupFieldMap;
  link?: {
    blueprint: string;
    keys: LookupFieldMap;
  };
}

export interface LookupFieldMap {
  [key: string]: LookupField;
}

export interface LookupField {
  modifier?: string;
  value: number | string | boolean | Date;
}

export interface LookupFieldChange {
  key: string;
  value: LookupField;
}
