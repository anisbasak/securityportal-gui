import { FormControl, AbstractControl } from '@angular/forms';
import { DateUtil } from '../utilities/date.util';

import * as isAfter from 'date-fns/is_after';

import { SatStartSchedule, SatEndSchedule } from '../models/schedule.model';

/**
 * Returns a validation error when both start and end datetimes exist,
 * and the end datetime is not after the start datetime.
 */
export const EndAfterStart = (control: AbstractControl): {[key: string]: boolean} => {

  // Get start date time and convert to combined
  const start: SatStartSchedule = (control.get('start') as FormControl).value;
  if (!start.date || !start.time) { return null; }
  const combinedStart = DateUtil.mergeDateAndTime(start.date, start.time);

  // Get end date
  const endControl = control.get('end') as FormControl;
  if (!endControl) { return null; }
  const end: SatEndSchedule = endControl.value;
  if (end.selection === 'never' || !end.date) { return null; }

  // Compare start and end date
  return isAfter(end.date, combinedStart)
    ? null
    : { endAfterStart: true };
};
