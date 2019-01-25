import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromAuthentication from './authentication';
import * as fromOauth from './oauth';

export const AUTH_FEATURE_NAME = 'auth';

export interface AuthState {
  authentication: fromAuthentication.AuthenticationState;
  oauth: fromOauth.OauthState;
}

export const reducers: ActionReducerMap<AuthState> = {
  authentication: fromAuthentication.reducer,
  oauth: fromOauth.reducer,
};

export const getAuthState = createFeatureSelector<AuthState>(AUTH_FEATURE_NAME);
