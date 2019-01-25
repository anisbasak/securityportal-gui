import * as fromLoading from '../actions/loading.action';

export interface LoadingState {
  /** Map of loading entity ids and their delays (ms). */
  loading: {
    [id: number]: number;
  };

  /** IDs of loading entities that have surpassed their delays. */
  expired: number[];
}

export const initialState: LoadingState = {
  loading: {},
  expired: [],
};

export function reducer(
  state = initialState,
  action: fromLoading.LoadingAction,
): LoadingState {

  switch (action.type) {
    case fromLoading.LOADING_START: {
      const { id, delay } = action.payload;

      const loading = {
        ...state.loading,
        [id]: delay,
      };

      return {
        ...state,
        loading,
      };
    }

    case fromLoading.LOADING_COMPLETE: {
      const { id } = action.payload;
      const { [id]: delay, ...rest } = state.loading;
      const expired = state.expired.filter(item => item !== id);

      return {
        ...state,
        loading: rest,
        expired,
      };
    }

    case fromLoading.SHOW_LOADER: {
      const { id } = action.payload;
      const expired = [...state.expired, id];

      return { ...state, expired };
    }
  }

  return state;
}

export const getLoadingEntities = (state: LoadingState) => state.loading;
export const getExpiredIds = (state: LoadingState) => state.expired;
