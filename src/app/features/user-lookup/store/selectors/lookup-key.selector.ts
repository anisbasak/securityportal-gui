import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromKeys from '../reducers/lookup-key.reducer';

export const getLookupKeyState = createSelector(
  fromFeature.getUserLookupState,
  state => state.keys,
);

export const getLookupKeys = createSelector(
  getLookupKeyState,
  fromKeys.getKeys,
);

export const getLookupKeysLoading = createSelector(
  getLookupKeyState,
  fromKeys.getKeysLoading,
);

export const getLookupKeysLoaded = createSelector(
  getLookupKeyState,
  fromKeys.getKeysLoaded,
);
