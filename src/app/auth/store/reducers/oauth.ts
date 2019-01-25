import * as fromOauth from '../actions/oauth.action';
import * as fromStorage from '../storage/oauth.storage';

export interface OauthState {
  authorizing: boolean;
  authorized: boolean;
  exchanging: boolean;
  exchanged: boolean;
  authorizationState?: string;
}

export const DEFAULT_STATE: OauthState = {
  authorizing: false,
  authorized: false,
  exchanging: false,
  exchanged: false,
};

export function getInitialState(): OauthState {
  const previousState = fromStorage.get();
  fromStorage.remove();
  return { ...DEFAULT_STATE, ...previousState };
}

export function reducer(state = getInitialState(), action: fromOauth.OauthAction): OauthState {
  switch (action.type) {
    case (fromOauth.AUTHORIZE): {
      const { authorizationState } = action.payload;
      return {
        ...state,
        authorizing: true,
        authorizationState,
      };
    }

    case (fromOauth.AUTHORIZE_CALLBACK): {
      return {
        ...state,
        authorizing: false,
        authorized: true,
      };
    }

    case (fromOauth.AUTHORIZE_CALLBACK_FAIL): {
      return {
        ...state,
        authorizing: false,
        authorized: false,
      };
    }

    case (fromOauth.CODE_EXCHANGE): {
      return {
        ...state,
        exchanging: true,
      };
    }

    case (fromOauth.CODE_EXCHANGE_SUCCESS): {
      const { authorizationState, ...remainder } = state;
      return {
        ...remainder,
        exchanging: false,
        exchanged: true,
      };
    }

    case (fromOauth.CODE_EXCHANGE_FAIL): {
      const { authorizationState, ...remainder } = state;
      return {
        ...remainder,
        exchanging: false,
        exchanged: false,
      };
    }
  }

  return state;
}

export const getAuthorizing = (state: OauthState) => state.authorizing;
export const getAuthorized = (state: OauthState) => state.authorized;
export const getExchanging = (state: OauthState) => state.exchanging;
export const getExchanged = (state: OauthState) => state.exchanged;
export const getAuthorizationState = (state: OauthState) => state.authorizationState;
