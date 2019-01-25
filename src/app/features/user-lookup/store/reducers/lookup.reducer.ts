import * as fromModels from '../../models';
import * as fromLookup from '../actions/lookup.action';

export interface UserLookupResultsState {
  // search results
  results: fromModels.UserLookupResponse[];
  resultsLoading: boolean;
  resultsLoaded: boolean;
  resultsError?: any;

  // Preview
  previewUserId: string | null;

  // detailed information
  userLoading: boolean;
  userLoadingError?: any;
  users: {
    [id: string]: fromModels.User
  };
}

export const initialState: UserLookupResultsState = {
  results: [],
  resultsLoading: false,
  resultsLoaded: false,

  previewUserId: null,

  userLoading: false,
  users: {},
};

export function reducer(
  state = initialState,
  action: fromLookup.LookupAction,
): UserLookupResultsState {

  switch (action.type) {
    case fromLookup.LOOKUP: {
      // Reset any lookup errors
      const { resultsError, ...rest } = state;

      return {
        ...rest,
        results: [],
        resultsLoading: true,
        resultsLoaded: false,
        previewUserId: null,
      };
    }

    case fromLookup.LOOKUP_FAIL: {
      const error = action.payload;

      return {
        ...state,
        resultsLoading: false,
        resultsError: error,
      };
    }

    case fromLookup.LOOKUP_SUCCESS: {
      const { users } = action.payload;
      return {
        ...state,
        resultsLoading: false,
        resultsLoaded: true,
        results: users,
      };
    }

    case fromLookup.PREVIEW_USER: {
      const { id } = action.payload;
      return {
        ...state,
        previewUserId: id,
      };
    }

    case fromLookup.CLEAR_PREVIEW_USER: {
      const { previewUserId, ...rest } = state;
      return {
        ...rest,
        previewUserId: null
      };
    }

    case fromLookup.LOAD_USER: {
      // Reset any lookup errors
      const { userLoadingError, ...rest } = state;

      return {
        ...rest,
        userLoading: true,
      };
    }

    case fromLookup.LOAD_USER_FAIL: {
      const error = action.payload;

      return {
        ...state,
        userLoading: false,
        userLoadingError: error,
      };
    }

    case fromLookup.LOAD_USER_SUCCESS: {
      const user = action.payload;
      const oldUsers = state.users;
      const users = {
        ...oldUsers,
        [user._id]: user,
      };

      return {
        ...state,
        userLoading: false,
        users,
      };
    }

    case fromLookup.CLEAR_USER_RESULTS: {
      // Reset any lookup errors
      const { resultsError, ...rest } = state;

      return {
        ...rest,
        results: [],
        resultsLoading: false,
        resultsLoaded: false,
        previewUserId: null,
      };
    }

  }

  return state;
}

export const getResults = (state: UserLookupResultsState) => state.results;
export const getResultsLoading = (state: UserLookupResultsState) => state.resultsLoading;
export const getResultsLoaded = (state: UserLookupResultsState) => state.resultsLoaded;
export const getResultsError = (state: UserLookupResultsState) => state.resultsError;
export const getPreviewUserId = (state: UserLookupResultsState) => state.previewUserId;
export const getUserLoading = (state: UserLookupResultsState) => state.userLoading;
export const getUserLoadingError = (state: UserLookupResultsState) => state.userLoadingError;
export const getUserEntities = (state: UserLookupResultsState) => state.users;
