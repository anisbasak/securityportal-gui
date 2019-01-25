import { Action } from '@ngrx/store';

export const LOADING_START = '[Core] Loading Start';
export const LOADING_COMPLETE = '[Core] Loading Complete';
export const SHOW_LOADER = '[Core] Show Loader';
export const HIDE_LOADER = '[Core] Hide Loader';

export class LoadingStart implements Action {
  readonly type = LOADING_START;
  constructor(public payload: {
    id: number,
    delay: number,
    data?: any
  }) {}
}

export class LoadingComplete implements Action {
  readonly type = LOADING_COMPLETE;
  constructor(public payload: { id: number }) {}
}

export class ShowLoader implements Action {
  readonly type = SHOW_LOADER;
  constructor(public payload: { id: number }) {}
}

export type LoadingAction =
 | LoadingStart
 | LoadingComplete
 | ShowLoader;
