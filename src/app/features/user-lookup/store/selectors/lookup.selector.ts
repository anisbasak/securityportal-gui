import { createSelector } from '@ngrx/store';

import * as fromRoot from '@app/store';
import * as fromFeature from '../reducers';
import * as fromLookup from '../reducers/lookup.reducer';
import * as fromModels from '../../models';

export const getLookupState = createSelector(
  fromFeature.getUserLookupState,
  state => state.lookup,
);

export const getLookupResults = createSelector(
  getLookupState,
  fromLookup.getResults,
);

export const getLookupResultsLoading = createSelector(
  getLookupState,
  fromLookup.getResultsLoading,
);

export const getLookupResultsLoaded = createSelector(
  getLookupState,
  fromLookup.getResultsLoaded,
);

export const getLookupResultsError = createSelector(
  getLookupState,
  fromLookup.getResultsError,
);

export const getPreviewUserId = createSelector(
  getLookupState,
  fromLookup.getPreviewUserId,
);

export const getUserLoading = createSelector(
  getLookupState,
  fromLookup.getUserLoading,
);

export const getUserLoadingError = createSelector(
  getLookupState,
  fromLookup.getUserLoadingError,
);

export const getUserEntities = createSelector(
  getLookupState,
  fromLookup.getUserEntities,
);

export const getPreviewUser = createSelector(
  getUserEntities,
  getPreviewUserId,
  (entities, id): fromModels.User => id && entities[id]
);

export const getSelectedUser = createSelector(
  getUserEntities,
  fromRoot.getRouterState,
  (entities, router): fromModels.User => {
    return router.state && entities[router.state.params.userId];
  }
);
