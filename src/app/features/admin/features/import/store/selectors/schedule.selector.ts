import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromSchedule from '../reducers/schedule.reducer';

export const getScheduleState = createSelector(
  fromFeature.getImportState,
  state => state.schedules,
);

export const getSchedules = createSelector(
  getScheduleState,
  fromSchedule.getSchedules,
);

export const getSchedulesLoading = createSelector(
  getScheduleState,
  fromSchedule.getSchedulesLoading,
);

export const getSchedulesLoaded = createSelector(
  getScheduleState,
  fromSchedule.getSchedulesLoaded,
);
