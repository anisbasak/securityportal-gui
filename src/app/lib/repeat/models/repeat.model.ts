/** Possible value for a relative day adjustment type */
export type SatRelativeDay =
    'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'day'
  | 'weekday'
  | 'weekend day';

/** Possible unit for a repeat object */
export type SatRepeatUnit = 'day' | 'week' | 'month' | 'year';

/** Describes a relative day of month via unit and type (e.g 1st Friday) */
export interface SatRelativeDayOfMonth {
  relative: number;
  type: SatRelativeDay;
}

/** Describes irregular adjustments in a repeat object */
export interface SatRepeatAdjustment {
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  relativeDayOfMonth?: SatRelativeDayOfMonth;
  monthsOfYear?: number[];
}

/**
 * Describes how often a repeating event should happen, along with any
 * irregular adjustments
*/
export interface SatRepeat {
  unit: SatRepeatUnit;
  frequency: number;
  adjustment?: SatRepeatAdjustment;
}
