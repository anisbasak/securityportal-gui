import { Action } from '@ngrx/store';

import * as fromModels from '../../models';

// options
export const LOAD_API_OPTIONS = '[Core] Load Api Options';
export const LOAD_API_OPTIONS_FAIL = '[Core] Load Api Options Fail';
export const LOAD_API_OPTIONS_SUCCESS = '[Core] Load Api Options Success';

export class LoadApiOptions implements Action {
  readonly type = LOAD_API_OPTIONS;
}

export class LoadApiOptionsFail implements Action {
  readonly type = LOAD_API_OPTIONS_FAIL;
  constructor(public payload: any) {}
}

export class LoadApiOptionsSuccess implements Action {
  readonly type = LOAD_API_OPTIONS_SUCCESS;
  constructor(public payload: fromModels.Resource[]) {}
}

// version
export const LOAD_API_VERSION = '[Core] Load Api Version';
export const LOAD_API_VERSION_FAIL = '[Core] Load Api Version Fail';
export const LOAD_API_VERSION_SUCCESS = '[Core] Load Api Version Success';

export class LoadApiVersion implements Action {
  readonly type = LOAD_API_VERSION;
}

export class LoadApiVersionFail implements Action {
  readonly type = LOAD_API_VERSION_FAIL;
  constructor(public payload: any) {}
}

export class LoadApiVersionSuccess implements Action {
  readonly type = LOAD_API_VERSION_SUCCESS;
  constructor(public payload: fromModels.ApiVersion) {}
}

export type ApiAction =
  | LoadApiOptions
  | LoadApiOptionsFail
  | LoadApiOptionsSuccess
  | LoadApiVersion
  | LoadApiVersionFail
  | LoadApiVersionSuccess;
