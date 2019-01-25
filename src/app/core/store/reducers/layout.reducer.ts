import * as fromLayout from '../actions/layout.action';

export interface LayoutState {
  largeViewport: boolean;
  sidenavOpen: boolean;
}

export const initialState: LayoutState = {
  largeViewport: true,
  sidenavOpen: true,
};

export function reducer(
  state = initialState,
  action: fromLayout.LayoutAction,
): LayoutState {

  switch (action.type) {
    case fromLayout.VIEWPORT_RESIZE: {
      return {
        ...state,
        largeViewport: action.payload,
        sidenavOpen: action.payload,
      };
    }

    case fromLayout.OPEN_SIDENAV: {
      return { ...state, sidenavOpen: true };
    }

    case fromLayout.CLOSE_SIDENAV: {
      return { ...state, sidenavOpen: false };
    }

    case fromLayout.TOGGLE_SIDENAV: {
      const prevState = state.sidenavOpen;
      return { ...state, sidenavOpen: !prevState };
    }

    case fromLayout.CLOSE_SIDENAV_WHEN_SMALL: {
      const small = !state.largeViewport;

      return small
        ? { ...state, sidenavOpen: false }
        : state;
    }
  }

  return state;
}

export const getLargeViewport = (state: LayoutState) => state.largeViewport;
export const getSidenavOpen = (state: LayoutState) => state.sidenavOpen;
