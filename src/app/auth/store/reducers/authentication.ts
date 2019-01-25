import * as fromAuthentication from '../actions/authentication.action';
import * as fromStorage from '../storage/authentication.storage';

export interface AuthenticationState {
  token?: string;
  confirmed: boolean;
  confirming: boolean;
  authenticated: boolean;
  extending: boolean;
}

// The default state can be considered 'confirmed' since
// we know the user is not authenticated when lacking a token.
export const DEFAULT_STATE: AuthenticationState = {
  confirmed: true,
  confirming: false,
  authenticated: false,
  extending: false,
};

export function getInitialState(): AuthenticationState {
  // Hydrate the initial state depending on whether an access token
  // currently exists in local storage
  const previousState = fromStorage.get();

  if (previousState) {
    const { token } = previousState;

    if (token) {
      // Having a token in local storage doesn't mean the token is still
      // valid. Note that the authentication state is still 'unconfirmed'.
      return {
        token,
        confirmed: false,
        confirming: false,
        authenticated: false,
        extending: false,
      };
    }
  }

  return DEFAULT_STATE;
}

export function reducer(
  state = getInitialState(),
  action: fromAuthentication.AuthenticationAction
): AuthenticationState {

  switch (action.type) {
    case (fromAuthentication.CONFIRM_TOKEN): {
      return {
        ...state,
        confirming: true,
      };
    }

    case (fromAuthentication.STORE_TOKEN): {
      const { token } = action.payload;
      return {
        ...state,
        confirmed: true,
        confirming: false,
        authenticated: true,
        token,
      };
    }

    case (fromAuthentication.REVOKE_TOKEN_SUCCESS): {
      const { token, ...remainder } = state;
      return {
        ...remainder,
        authenticated: false,
      };
    }

    case (fromAuthentication.EXTEND_TOKEN): {
      return {
        ...state,
        extending: true,
      };
    }

    case (fromAuthentication.EXTEND_TOKEN_SUCCESS):
    case (fromAuthentication.EXTEND_TOKEN_FAIL): {
      return {
        ...state,
        extending: false,
      };
    }

  }

  return state;
}

export const getTokenConfirming = (state: AuthenticationState) => state.confirming;
export const getTokenConfirmed = (state: AuthenticationState) => state.confirmed;
export const getIsAuthenticated = (state: AuthenticationState) => state.authenticated;
export const getToken = (state: AuthenticationState) => state.token;
