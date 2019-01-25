import { Action } from '@ngrx/store';

import * as fromModels from '../../models';

// lookup keys
export const LOAD_LOOKUP_KEYS = '[User Lookup] Load Lookup Keys';
export const LOAD_LOOKUP_KEYS_FAIL = '[User Lookup] Load Lookup Keys Fail';
export const LOAD_LOOKUP_KEYS_SUCCESS = '[User Lookup] Load Lookup Keys Success';

export class LoadLookupKeys implements Action {
  readonly type = LOAD_LOOKUP_KEYS;
}

export class LoadLookupKeysFail implements Action {
  readonly type = LOAD_LOOKUP_KEYS_FAIL;
  constructor(public payload: any) {}
}

export class LoadLookupKeysSuccess implements Action {
  readonly type = LOAD_LOOKUP_KEYS_SUCCESS;
  constructor(public payload: fromModels.LookupKeysResponse) {}
}

export type LookupKeyAction =
  | LoadLookupKeys
  | LoadLookupKeysFail
  | LoadLookupKeysSuccess;
