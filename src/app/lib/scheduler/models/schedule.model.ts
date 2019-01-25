import { SatRepeat } from '@app/lib/repeat';

/** Describes if and when an event should start */
export interface SatStartSchedule {
  enabled: boolean;
  date?: Date;
  time?: string;
}

/** Describes how an event should repeat */
export interface SatRepeatSchedule {
  selection: 'none' | 'day' | 'week' | 'month' | 'year' | 'custom';
  custom: SatRepeat | null;
}

/** Describes if and how an event should end */
export interface SatEndSchedule {
  selection: 'never' | 'date' | 'count';
  date?: Date;
  count?: number;
}

/** Describes when an event should start and end and how it should repeat */
export interface SatSchedule {
  start: SatStartSchedule;
  repeat?: SatRepeatSchedule;
  end?: SatEndSchedule;
}
