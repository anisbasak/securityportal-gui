import { Action } from '@ngrx/store';

import * as fromModels from '../../models';

export const LOOKUP = '[User Lookup] Lookup';
export const LOOKUP_FAIL = '[User Lookup] Lookup Fail';
export const LOOKUP_SUCCESS = '[User Lookup] Lookup Success';
export const PREVIEW_USER = '[User Lookup] Preview User';
export const CLEAR_PREVIEW_USER = '[User Lookup] Clear Preview User';
export const LOAD_USER = '[User Lookup] Load User';
export const LOAD_USER_FAIL = '[User Lookup] Load User Fail';
export const LOAD_USER_SUCCESS = '[User Lookup] Load User Success';
export const CLEAR_USER_RESULTS = '[User Lookup] Clear User Results';

export class Lookup implements Action {
  readonly type = LOOKUP;
}

export class LookupFail implements Action {
  readonly type = LOOKUP_FAIL;
  constructor(public payload: any) {}
}

export class LookupSuccess implements Action {
  readonly type = LOOKUP_SUCCESS;
  constructor(public payload: fromModels.LookupResults) {}
}

export class PreviewUser implements Action {
  readonly type = PREVIEW_USER;
  constructor(public payload: { id: string }) {}
}

export class ClearPreviewUser implements Action {
  readonly type = CLEAR_PREVIEW_USER;
}

export class LoadUser implements Action {
  readonly type = LOAD_USER;
  constructor(public payload: { id: string }) {}
}

export class LoadUserFail implements Action {
  readonly type = LOAD_USER_FAIL;
  constructor(public payload: any) {}
}

export class LoadUserSuccess implements Action {
  readonly type = LOAD_USER_SUCCESS;
  constructor(public payload: fromModels.User) {}
}

export class ClearUserResults implements Action {
  readonly type = CLEAR_USER_RESULTS;
}

export type LookupAction =
  | Lookup
  | LookupFail
  | LookupSuccess
  | PreviewUser
  | ClearPreviewUser
  | LoadUser
  | LoadUserFail
  | LoadUserSuccess
  | ClearUserResults;
