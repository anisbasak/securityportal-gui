import * as format from 'date-fns/format';
import * as parse from 'date-fns/parse';

export class DateUtil {

  /** Splits off time portion of passed date and appends new time */
  static mergeDateAndTime(date: Date, time: string): Date {
    const justDate = format(date, 'YYYY-MM-DD');
    const justTime = time;

    return parse(`${justDate}T${justTime}`);
  }

}
