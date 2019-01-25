import { Action } from '@ngrx/store';

import * as fromModels from '../../models';

export const LOAD_SCHEDULES = '[Import] Load Schedules';
export const LOAD_SCHEDULES_FAIL = '[Import] Load Schedules Fail';
export const LOAD_SCHEDULES_SUCCESS = '[Import] Load Schedules Success';

export class LoadSchedules implements Action {
  readonly type = LOAD_SCHEDULES;
}

export class LoadSchedulesFail implements Action {
  readonly type = LOAD_SCHEDULES_FAIL;
  constructor(public payload: any) {}
}

export class LoadSchedulesSuccess implements Action {
  readonly type = LOAD_SCHEDULES_SUCCESS;
  constructor(public payload: fromModels.Schedule[]) {}
}

export type ScheduleAction =
  | LoadSchedules
  | LoadSchedulesFail
  | LoadSchedulesSuccess;
