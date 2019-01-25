import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromLoading from '../reducers/loading.reducer';

export const getLoadingState = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.CoreState) => state.loading,
);

export const getLoadingEntities = createSelector(
  getLoadingState,
  fromLoading.getLoadingEntities,
);

export const getExpiredIds = createSelector(
  getLoadingState,
  fromLoading.getExpiredIds,
);

export const getShowLoader = createSelector(
  getExpiredIds,
  ids => ids.length > 0,
);
