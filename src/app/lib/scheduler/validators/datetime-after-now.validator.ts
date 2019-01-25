import { FormControl, AbstractControl } from '@angular/forms';
import { DateUtil } from '../utilities/date.util';

import * as isFuture from 'date-fns/is_future';

/**
 * Returns a validation error when both date and time controls exist,
 * and the merged datetime is in the future.
 */
export const DatetimeAfterNow = (control: AbstractControl): {[key: string]: boolean} => {
  const date = (control.get('date') as FormControl).value;
  const time = (control.get('time') as FormControl).value;

  if (!date) { return null; }
  if (!time) { return null; }

  const combined = DateUtil.mergeDateAndTime(date, time);

  return isFuture(combined) ? null : { datetimeIsPast: true };
};
