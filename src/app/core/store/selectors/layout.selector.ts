import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromLayout from '../reducers/layout.reducer';

export const getLayoutState = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.CoreState) => state.layout,
);

export const getWhetherViewportIsLarge = createSelector(
  getLayoutState,
  fromLayout.getLargeViewport,
);

export const getSidenavMode = createSelector(
  getWhetherViewportIsLarge,
  large => large ? 'side' : 'over',
);

export const getSidenavOpen = createSelector(
  getLayoutState,
  fromLayout.getSidenavOpen,
);
