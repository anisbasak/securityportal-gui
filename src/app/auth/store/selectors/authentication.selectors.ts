import { createSelector } from '@ngrx/store';
import * as fromReducers from '../reducers';
import * as fromAuthentication from '../reducers/authentication';

export const getAuthenticationState = createSelector(
  fromReducers.getAuthState,
  (state: fromReducers.AuthState) => state.authentication
);

export const getTokenConfirming = createSelector(
  getAuthenticationState,
  fromAuthentication.getTokenConfirming,
);

export const getTokenConfirmed = createSelector(
  getAuthenticationState,
  fromAuthentication.getTokenConfirmed,
);

export const getIsAuthenticated = createSelector(
  getAuthenticationState,
  fromAuthentication.getIsAuthenticated,
);

export const getToken = createSelector(
  getAuthenticationState,
  fromAuthentication.getToken,
);
