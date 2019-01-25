import { Action } from '@ngrx/store';

import * as fromModels from '../../models';

// load user
export const LOAD_USER = '[Core] Load User';
export const LOAD_USER_SUCCESS = '[Core] Load User Success';
export const LOAD_USER_FAIL = '[Core] Load User Fail';

export class LoadUser implements Action {
  readonly type = LOAD_USER;
}

export class LoadUserSuccess implements Action {
  readonly type = LOAD_USER_SUCCESS;
  constructor(public payload: fromModels.CoreUser) {}
}

export class LoadUserFail implements Action {
  readonly type = LOAD_USER_FAIL;
  constructor(public payload: any) {}
}

// load profile
export const LOAD_PROFILE_USER = '[Core] Load Profile User';
export const LOAD_PROFILE_USER_SUCCESS = '[Core] Load Profile User Success';
export const LOAD_PROFILE_USER_FAIL = '[Core] Load Profile User Fail';

export class LoadProfileUser implements Action {
  readonly type = LOAD_PROFILE_USER;
}

export class LoadProfileUserSuccess implements Action {
  readonly type = LOAD_PROFILE_USER_SUCCESS;
  constructor(public payload: fromModels.ProfileUser) {}
}

export class LoadProfileUserFail implements Action {
  readonly type = LOAD_PROFILE_USER_FAIL;
  constructor(public payload: any) {}
}


// discard user
export const DISCARD_USER = '[Core] Discard User';

export class DiscardUser implements Action {
  readonly type = DISCARD_USER;
}

export type UserActions =
 | LoadUser
 | LoadUserSuccess
 | LoadUserFail
 | LoadProfileUser
 | LoadProfileUserSuccess
 | LoadProfileUserFail
 | DiscardUser;
