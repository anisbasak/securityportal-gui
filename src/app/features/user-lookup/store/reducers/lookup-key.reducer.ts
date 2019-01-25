import * as fromModels from '../../models';
import * as fromLookupKeys from '../actions/lookup-key.action';

export interface LookupKeyState {
  keys: fromModels.LookupKeysResponse;
  keysLoading: boolean;
  keysLoaded: boolean;
}

export const initialState: LookupKeyState = {
  keys: null,
  keysLoading: false,
  keysLoaded: false,
};

export function reducer(
  state = initialState,
  action: fromLookupKeys.LookupKeyAction,
): LookupKeyState {

  switch (action.type) {
    case fromLookupKeys.LOAD_LOOKUP_KEYS: {
      return { ...state, keysLoading: true };
    }

    case fromLookupKeys.LOAD_LOOKUP_KEYS_FAIL: {
      return { ...state, keysLoading: false, keysLoaded: false };
    }

    case fromLookupKeys.LOAD_LOOKUP_KEYS_SUCCESS: {
      const keys = action.payload;
      return { ...state, keys, keysLoading: false, keysLoaded: true };
    }
  }

  return state;

}

export const getKeys = (state: LookupKeyState) => state.keys;
export const getKeysLoading = (state: LookupKeyState) => state.keysLoading;
export const getKeysLoaded = (state: LookupKeyState) => state.keysLoaded;
