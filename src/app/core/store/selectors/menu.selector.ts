import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromMenu from '../reducers/menu.reducer';

export const getMenuState = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.CoreState) => state.menu,
);

export const getMenu = createSelector(
  getMenuState,
  fromMenu.getMenu,
);

export const getMenuLoading = createSelector(
  getMenuState,
  fromMenu.getMenuLoading,
);

export const getMenuLoaded = createSelector(
  getMenuState,
  fromMenu.getMenuLoaded,
);

