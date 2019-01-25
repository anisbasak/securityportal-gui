import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromModels from '../../models';
import * as fromForm from './form.reducer';
import * as fromLookup from './lookup.reducer';
import * as fromLookupKey from './lookup-key.reducer';

export interface UserLookupState {
  form: fromModels.UserLookupFormState;
  lookup: fromLookup.UserLookupResultsState;
  keys: fromLookupKey.LookupKeyState;
}

export const reducers: ActionReducerMap<UserLookupState> = {
  form: fromForm.reducer,
  lookup: fromLookup.reducer,
  keys: fromLookupKey.reducer,
};

export const getUserLookupState = createFeatureSelector<UserLookupState>('user-lookup');
