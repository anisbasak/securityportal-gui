import { Action } from '@ngrx/store';

import * as fromModels from '../../models';

export const RESET_FORM = '[User Lookup] Reset Form';
export const UPDATE_FORM_GENERAL_FIELD = '[User Lookup] Update Form General Field';
export const UPDATE_FORM_USER_FIELD = '[User Lookup] Update Form User Field';
export const UPDATE_FORM_LINK_SELECTION = '[User Lookup] Update Form Link Selection';
export const UPDATE_FORM_LINK_FIELD = '[User Lookup] Update Form Link Field';

export class ResetForm implements Action {
  readonly type = RESET_FORM;
}

export class UpdateFormGeneralField implements Action {
  readonly type = UPDATE_FORM_GENERAL_FIELD;
  constructor(public payload: string) {}
}

export class UpdateFormUserField implements Action {
  readonly type = UPDATE_FORM_USER_FIELD;
  constructor(public payload: fromModels.LookupFieldChange) {}
}

export class UpdateFormLinkSelection implements Action {
  readonly type = UPDATE_FORM_LINK_SELECTION;
  constructor(public payload: { blueprint: string }) {}
}

export class UpdateFormLinkField implements Action {
  readonly type = UPDATE_FORM_LINK_FIELD;
  constructor(public payload: fromModels.LookupFieldChange) {}
}

export type FormAction =
  | ResetForm
  | UpdateFormGeneralField
  | UpdateFormUserField
  | UpdateFormLinkSelection
  | UpdateFormLinkField;
