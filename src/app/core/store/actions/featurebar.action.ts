import { Action } from '@ngrx/store';

// featurebar
export const SET_FEATURE_TITLE = '[Core] Set Feature Title';

export class SetFeatureTitle implements Action {
  readonly type = SET_FEATURE_TITLE;
  constructor(public payload: { title: string }) {}
}

export type FeaturebarAction =
  | SetFeatureTitle;
