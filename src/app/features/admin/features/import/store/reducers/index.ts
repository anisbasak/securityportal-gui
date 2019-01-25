import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromSchedule from './schedule.reducer';
import * as fromTask from './task.reducer';

export interface ImportState {
  schedules: fromSchedule.ImportScheduleState;
  tasks: fromTask.ImportTaskState;
}

export const reducers: ActionReducerMap<ImportState> = {
  schedules: fromSchedule.reducer,
  tasks: fromTask.reducer,
};

export const getImportState = createFeatureSelector<ImportState>('import');
