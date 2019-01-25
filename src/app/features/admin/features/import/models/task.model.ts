export interface Task {
  mode: string;
  state: string;
  origin: {
    name: string;
    instance: string;
    label: string;
  };
  dates: {
    created: string;
    started: string;
    updated: string;
    completed: string;
    suspended: string;
    delayUntil: string;
  };
  stats: {
    percentComplete: number;
    offset: number;
    current: number;
    total: number;
  };
}
