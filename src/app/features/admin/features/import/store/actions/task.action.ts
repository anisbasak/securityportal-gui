import { Action } from '@ngrx/store';

import * as fromModels from '../../models';

export const LOAD_TASKS = '[Import] Load Tasks';
export const LOAD_TASKS_FAIL = '[Import] Load Tasks Fail';
export const LOAD_TASKS_SUCCESS = '[Import] Load Tasks Success';

export class LoadTasks implements Action {
  readonly type = LOAD_TASKS;
}

export class LoadTasksFail implements Action {
  readonly type = LOAD_TASKS_FAIL;
  constructor(public payload: any) {}
}

export class LoadTasksSuccess implements Action {
  readonly type = LOAD_TASKS_SUCCESS;
  constructor(public payload: fromModels.Task[]) {}
}

export type TaskAction =
  | LoadTasks
  | LoadTasksFail
  | LoadTasksSuccess;
