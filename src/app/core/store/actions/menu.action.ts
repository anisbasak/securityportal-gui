import { Action } from '@ngrx/store';

import * as fromModels from '../../models';

// load menu
export const LOAD_MENU = '[Core] Load Menu';
export const LOAD_MENU_FAIL = '[Core] Load Menu Fail';
export const LOAD_MENU_SUCCESS = '[Core] Load Menu Success';

export class LoadMenu implements Action {
  readonly type = LOAD_MENU;
}

export class LoadMenuFail implements Action {
  readonly type = LOAD_MENU_FAIL;
  constructor(public payload: any) {}
}

export class LoadMenuSuccess implements Action {
  readonly type = LOAD_MENU_SUCCESS;
  constructor(public payload: fromModels.MenuObject[]) {}
}

export type MenuActions =
 | LoadMenu
 | LoadMenuFail
 | LoadMenuSuccess;
