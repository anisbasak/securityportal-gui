import * as fromModels from '../../models';
import * as fromMenu from '../actions/menu.action';

export interface MenuState {
  menu: fromModels.MenuObject[];
  loading: boolean;
  loaded: boolean;
}

export const initialState: MenuState = {
  menu: [],
  loading: false,
  loaded: false,
};

export function reducer(
  state = initialState,
  action: fromMenu.MenuActions,
): MenuState {

  switch (action.type) {
    case fromMenu.LOAD_MENU: {
      return {
        ...state,
        loading: true,
      };
    }

    case fromMenu.LOAD_MENU_SUCCESS: {
      const menu = action.payload;
      return {
        ...state,
        loading: false,
        loaded: true,
        menu,
      };
    }

    case fromMenu.LOAD_MENU_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
      };
    }
  }

  return state;
}

export const getMenu = (state: MenuState) => state.menu;
export const getMenuLoading = (state: MenuState) => state.loading;
export const getMenuLoaded = (state: MenuState) => state.loaded;
