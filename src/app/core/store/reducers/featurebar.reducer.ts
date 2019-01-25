import * as fromModels from '../../models';
import * as fromFeaturebar from '../actions/featurebar.action';

export interface FeaturebarState {
  title: string;
  back: fromModels.FeaturebarBack;
  crumbs: fromModels.FeaturebarLink[];
  tabs: fromModels.FeaturebarLink[];
}

export const initialState: FeaturebarState = {
  title: '',
  back: { enabled: false },
  crumbs: [],
  tabs: [],
};

export function reducer(
  state = initialState,
  action: fromFeaturebar.FeaturebarAction,
): FeaturebarState {

  switch (action.type) {
    case fromFeaturebar.SET_FEATURE_TITLE: {
      const { title } = action.payload;
      return {
        ...state,
        title,
      };
    }
  }

  return state;
}

export const getFeaturebarTitle = (state: FeaturebarState) => state.title;
export const getFeaturebarBack = (state: FeaturebarState) => state.back;
export const getFeaturebarCrumbs = (state: FeaturebarState) => state.crumbs;
export const getFeaturebarTabs = (state: FeaturebarState) => state.tabs;
