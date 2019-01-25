import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromApi from './api.reducer';
import * as fromFeaturebar from './featurebar.reducer';
import * as fromLayout from './layout.reducer';
import * as fromLoading from './loading.reducer';
import * as fromMenu from './menu.reducer';
import * as fromRules from './rules.reducer';
import * as fromUser from './user.reducer';

export interface CoreState {
  api: fromApi.ApiState;
  featurebar: fromFeaturebar.FeaturebarState;
  layout: fromLayout.LayoutState;
  loading: fromLoading.LoadingState;
  menu: fromMenu.MenuState;
  rules: fromRules.RulesState;
  user: fromUser.UserState;
}

export const reducers: ActionReducerMap<CoreState> = {
  api: fromApi.reducer,
  featurebar: fromFeaturebar.reducer,
  layout: fromLayout.reducer,
  loading: fromLoading.reducer,
  menu: fromMenu.reducer,
  rules: fromRules.reducer,
  user: fromUser.reducer,
};

export const getCoreState = createFeatureSelector<CoreState>('core');
