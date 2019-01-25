import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromTask from '../reducers/task.reducer';

export const getTaskState = createSelector(
  fromFeature.getImportState,
  state => state.tasks,
);

export const getTasks = createSelector(
  getTaskState,
  fromTask.getTasks,
);

export const getTasksLoading = createSelector(
  getTaskState,
  fromTask.getTasksLoading,
);

export const getTasksLoaded = createSelector(
  getTaskState,
  fromTask.getTasksLoaded,
);
