import { createSelector } from '@ngrx/store';
import * as fromRoot from '../../../store';
import * as fromReducers from '../reducers';
import * as fromOauth from '../reducers/oauth';

export const getOauthState = createSelector(
  fromReducers.getAuthState,
  state => state.oauth
);

export const getCallbackQueryParams = createSelector(
  fromRoot.getRouterState,
  router => router.state.queryParams
);

export const getAuthorizationState = createSelector(
  getOauthState,
  fromOauth.getAuthorizationState,
);

export const getCallbackState = createSelector(
  getCallbackQueryParams,
  getAuthorizationState,
  (query, prevState) => {
    const { code, state } = query;
    return { code, state, prevState };
  }
);

export const getExchanging = createSelector(
  getOauthState,
  fromOauth.getExchanging,
);

export const getExchanged = createSelector(
  getOauthState,
  fromOauth.getExchanged,
);
