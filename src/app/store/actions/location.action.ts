import { Action } from '@ngrx/store';

export const LEAVE = '[Location] Leave';

export class Leave implements Action {
  readonly type = LEAVE;
  constructor(public payload: {
    location: string;
  }) { }
}

export type LocationActions = Leave;
