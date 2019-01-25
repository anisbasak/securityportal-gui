import { Action } from '@ngrx/store';
import {
  AuthorizationStateParameter,
  CodeExchangeResponse,
  CodeExchangeFailureResponse,
} from '../../models';

// authorization
export const AUTHORIZE = '[Oauth] Authorize';
export const AUTHORIZE_CALLBACK = '[Oauth] Authorize Callback';
export const AUTHORIZE_CALLBACK_FAIL = '[Oauth] Authorize Callback Fail';

export class Authorize implements Action {
  readonly type = AUTHORIZE;
  constructor(public payload: AuthorizationStateParameter) {}
}

export class AuthorizeCallback implements Action {
  readonly type = AUTHORIZE_CALLBACK;
}

export class AuthorizeCallbackFail implements Action {
  readonly type = AUTHORIZE_CALLBACK_FAIL;
  constructor(public error: any) {}
}

// code exchange
export const CODE_EXCHANGE = '[Oauth] Code Exchange';
export const CODE_EXCHANGE_SUCCESS = '[Oauth] Code Exchange Success';
export const CODE_EXCHANGE_FAIL = '[Oauth] Code Exchange Fail';

export class CodeExchange implements Action {
  readonly type = CODE_EXCHANGE;
  constructor(public payload: {
    code: string;
    nextUrl: string;
  }) {}
}

export class CodeExchangeSuccess implements Action {
  readonly type = CODE_EXCHANGE_SUCCESS;
  constructor(public payload: {
    response: CodeExchangeResponse;
    nextUrl: string;
  }) {}
}

export class CodeExchangeFail implements Action {
  readonly type = CODE_EXCHANGE_FAIL;
  constructor(public payload: CodeExchangeFailureResponse) {}
}

export type OauthAction =
  | Authorize
  | AuthorizeCallback
  | AuthorizeCallbackFail
  | CodeExchange
  | CodeExchangeSuccess
  | CodeExchangeFail;
