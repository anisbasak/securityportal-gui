import { Action } from '@ngrx/store';
import { TokenInfoResponse, ExtendTokenResponse } from '../../models';

// confirm token
export const CONFIRM_TOKEN = '[Authentication] Confirm Token';

/**
 * Confirm the token's state. This action can be used immediately
 * or can be set to confirm at a later date.
 */
export class ConfirmToken implements Action {
  readonly type = CONFIRM_TOKEN;
  constructor(
    public payload: { delayMs: number } = { delayMs: 0 }
  ) {}
}

// revoke token
export const REVOKE_TOKEN = '[Authentication] Revoke Token';
export const REVOKE_TOKEN_SUCCESS = '[Authentication] Revoke Token Success';
export const REVOKE_TOKEN_FAIL = '[Authentication] Revoke Token Fail';

export class RevokeToken implements Action {
  readonly type = REVOKE_TOKEN;
}

export class RevokeTokenSuccess implements Action {
  readonly type = REVOKE_TOKEN_SUCCESS;
}

export class RevokeTokenFail implements Action {
  readonly type = REVOKE_TOKEN_FAIL;
  constructor(public error: any) {}
}


// extend token
export const EXTEND_TOKEN = '[Authentication] Extend Token';
export const EXTEND_TOKEN_SUCCESS = '[Authentication] Extend Token Success';
export const EXTEND_TOKEN_FAIL = '[Authentication] Extend Token Fail';

export class ExtendToken implements Action {
  readonly type = EXTEND_TOKEN;
}

export class ExtendTokenSuccess implements Action {
  readonly type = EXTEND_TOKEN_SUCCESS;
  constructor(public payload: ExtendTokenResponse) {}
}

export class ExtendTokenFail implements Action {
  readonly type = EXTEND_TOKEN_FAIL;
  constructor(public error: any) {}
}


// token info
export const TOKEN_INFO = '[Authentication] Token Info';
export const TOKEN_INFO_SUCCESS = '[Authentication] Token Info Success';
export const TOKEN_INFO_FAIL = '[Authentication] Token Info Fail';

export class TokenInfo implements Action {
  readonly type = TOKEN_INFO;
}

export class TokenInfoSuccess implements Action {
  readonly type = TOKEN_INFO_SUCCESS;
  constructor(public payload: TokenInfoResponse) {}
}

export class TokenInfoFail implements Action {
  readonly type = TOKEN_INFO_FAIL;
  constructor(public error: any) {}
}

// store token
export const STORE_TOKEN = '[Authentication] Store Token';

/**
 * Store a token in persistent storage. Use of this action implies
 * the token is valid and the user can be considered authenticated.
 */
export class StoreToken implements Action {
  readonly type = STORE_TOKEN;
  constructor(public payload: { token: string; }) {}
}

// token warning
export const SHOW_TOKEN_WARNING = '[Authentication] Show Token Warning';

export class ShowTokenWarning implements Action {
  readonly type = SHOW_TOKEN_WARNING;
  constructor(public payload: { expiration: Date; }) {}
}

export type AuthenticationAction =
  | ConfirmToken
  | RevokeToken
  | RevokeTokenSuccess
  | RevokeTokenFail
  | ExtendToken
  | ExtendTokenSuccess
  | ExtendTokenFail
  | TokenInfo
  | TokenInfoSuccess
  | TokenInfoFail
  | StoreToken
  | ShowTokenWarning;
