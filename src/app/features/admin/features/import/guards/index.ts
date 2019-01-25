import { SchedulesGuard } from './schedules.guard';
import { TasksGuard } from './tasks.guard';

export const guards = [
  SchedulesGuard,
  TasksGuard,
];

export * from './schedules.guard';
export * from './tasks.guard';
