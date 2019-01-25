import * as fromModels from '../../models';
import * as fromSchedules from '../actions/schedule.action';

export interface ImportScheduleState {
  schedules: fromModels.Schedule[];
  schedulesLoading: boolean;
  schedulesLoaded: boolean;
}

export const initialState: ImportScheduleState = {
  schedules: [],
  schedulesLoading: false,
  schedulesLoaded: false,
};

export function reducer(
  state = initialState,
  action: fromSchedules.ScheduleAction,
): ImportScheduleState {

  switch (action.type) {
    case fromSchedules.LOAD_SCHEDULES: {
      return { ...state, schedulesLoading: true };
    }

    case fromSchedules.LOAD_SCHEDULES_FAIL: {
      return { ...state, schedulesLoading: false, schedulesLoaded: false };
    }

    case fromSchedules.LOAD_SCHEDULES_SUCCESS: {
      const schedules = action.payload;
      return { ...state, schedules, schedulesLoading: false, schedulesLoaded: true };
    }
  }

  return state;
}

export const getSchedules = (state: ImportScheduleState) => state.schedules;
export const getSchedulesLoading = (state: ImportScheduleState) => state.schedulesLoading;
export const getSchedulesLoaded = (state: ImportScheduleState) => state.schedulesLoaded;
