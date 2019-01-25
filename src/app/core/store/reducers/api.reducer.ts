import * as fromModels from '../../models';
import * as fromApi from '../actions/api.action';

export interface ApiState {
  options: fromModels.Resources;
  optionsLoading: boolean;
  optionsLoaded: boolean;

  version: fromModels.ApiVersion;
  versionLoading: boolean;
  versionLoaded: boolean;
}

export const initialState: ApiState = {
  options: [],
  optionsLoading: false,
  optionsLoaded: false,

  version: null,
  versionLoading: false,
  versionLoaded: false,
};

export function reducer(
  state = initialState,
  action: fromApi.ApiAction,
): ApiState {

  switch (action.type) {
    case fromApi.LOAD_API_OPTIONS: {
      return { ...state, optionsLoading: true };
    }

    case fromApi.LOAD_API_OPTIONS_FAIL: {
      return { ...state, optionsLoading: false, optionsLoaded: false };
    }

    case fromApi.LOAD_API_OPTIONS_SUCCESS: {
      const options = action.payload;
      return {
        ...state,
        options,
        optionsLoading: false,
        optionsLoaded: true,
      };
    }

    case fromApi.LOAD_API_VERSION: {
      return { ...state, versionLoading: true };
    }

    case fromApi.LOAD_API_VERSION_FAIL: {
      return { ...state, versionLoading: false, versionLoaded: false };
    }

    case fromApi.LOAD_API_VERSION_SUCCESS: {
      const version = action.payload;
      return {
        ...state,
        version,
        versionLoading: false,
        versionLoaded: true,
      };
    }
  }

  return state;
}

export const getOptions = (state: ApiState) => state.options;
export const getOptionsLoading = (state: ApiState) => state.optionsLoading;
export const getOptionsLoaded = (state: ApiState) => state.optionsLoaded;
export const getVersion = (state: ApiState) => state.version;
export const getVersionLoading = (state: ApiState) => state.versionLoading;
export const getVersionLoaded = (state: ApiState) => state.versionLoaded;
