import * as fromModels from '../../models';
import * as fromTasks from '../actions/task.action';

export interface ImportTaskState {
  tasks: fromModels.Task[];
  tasksLoading: boolean;
  tasksLoaded: boolean;
}

export const initialState: ImportTaskState = {
  tasks: [],
  tasksLoading: false,
  tasksLoaded: false,
};

export function reducer(
  state = initialState,
  action: fromTasks.TaskAction,
): ImportTaskState {

  switch (action.type) {
    case fromTasks.LOAD_TASKS: {
      return { ...state, tasksLoading: true };
    }

    case fromTasks.LOAD_TASKS_FAIL: {
      return { ...state, tasksLoading: false, tasksLoaded: false };
    }

    case fromTasks.LOAD_TASKS_SUCCESS: {
      const tasks = action.payload;
      return { ...state, tasks, tasksLoading: false, tasksLoaded: true };
    }
  }

  return state;
}

export const getTasks = (state: ImportTaskState) => state.tasks;
export const getTasksLoading = (state: ImportTaskState) => state.tasksLoading;
export const getTasksLoaded = (state: ImportTaskState) => state.tasksLoaded;
