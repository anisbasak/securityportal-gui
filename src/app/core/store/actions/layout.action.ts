import { Action } from '@ngrx/store';

// viewport
export const VIEWPORT_RESIZE = '[Core] Viewport Resize';

export class ViewportResize implements Action {
  readonly type = VIEWPORT_RESIZE;

  /**
   * @param payload Whether the viewport is larger than the breakpoint.
   */
  constructor(public payload: boolean) {}
}

// sidenav
export const OPEN_SIDENAV = '[Core] Open Sidenav';
export const CLOSE_SIDENAV = '[Core] Close Sidenav';
export const TOGGLE_SIDENAV = '[Core] Toggle Sidenav';
export const CLOSE_SIDENAV_WHEN_SMALL = '[Core] Close Sidenav When Small';

export class OpenSidenav implements Action {
  readonly type = OPEN_SIDENAV;
}

export class CloseSidenav implements Action {
  readonly type = CLOSE_SIDENAV;
}

export class ToggleSidenav implements Action {
  readonly type = TOGGLE_SIDENAV;
}

export class CloseSidenavWhenSmall implements Action {
  readonly type = CLOSE_SIDENAV_WHEN_SMALL;
}

export type LayoutAction =
  | ViewportResize
  | OpenSidenav
  | CloseSidenav
  | ToggleSidenav
  | CloseSidenavWhenSmall;

