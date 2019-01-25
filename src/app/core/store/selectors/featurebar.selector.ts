import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromFeaturebar from '../reducers/featurebar.reducer';

export const getFeaturebarState = createSelector(
  fromFeature.getCoreState,
  state => state.featurebar,
);

export const getFeaturebarTitle = createSelector(
  getFeaturebarState,
  fromFeaturebar.getFeaturebarTitle,
);

export const getFeaturebarBack = createSelector(
  getFeaturebarState,
  fromFeaturebar.getFeaturebarBack,
);

export const getFeaturebarBackEnabled = createSelector(
  getFeaturebarBack,
  back => back.enabled,
);

export const getFeaturebarCrumbs = createSelector(
  getFeaturebarState,
  fromFeaturebar.getFeaturebarCrumbs,
);

export const getFeaturebarTabs = createSelector(
  getFeaturebarState,
  fromFeaturebar.getFeaturebarTabs,
);
