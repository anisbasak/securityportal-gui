import * as pluralize from 'pluralize';
import * as isToday from 'date-fns/is_today';
import * as isTomorrow from 'date-fns/is_tomorrow';
import * as isYesterday from 'date-fns/is_yesterday';
import * as isPast from 'date-fns/is_past';
import * as format from 'date-fns/format';

import {
  SatStartSchedule,
  SatRepeatSchedule,
  SatEndSchedule,
  SatSchedule
} from '../models/schedule.model';
import { DateUtil } from './date.util';

import { SatRepeatTranslationUtil } from '@app/lib/repeat';


export class SatScheduleTranslationUtil {

  /** Returns the entire schedule as comma-separated string */
  static scheduleAsString(data: SatSchedule): string {
    const vals = [];

    if (!data.start) { return ''; }
    if (!data.start.enabled) { return ''; }

    // Add the 'start' section
    vals.push(this.startAsString(data.start));

    // Add the 'repeat' section
    if (data.repeat && data.repeat.selection !== 'none') {
      vals.push(this.repeatAsString(data.repeat));
    }

    // Add the 'end section
    if (data.end && data.end.selection !== 'never') {
      vals.push(this.endAsString(data.end));
    }

    return vals.join(', ');
  }

  /** Returns the start schedule as a string */
  static startAsString(data: SatStartSchedule): string {
    let str = '';

    // Combine date in time to a single datetime
    const datetime = DateUtil.mergeDateAndTime(data.date, data.time);

    // Future/past prefix
    if (isPast(datetime)) {
      str += 'Ran ';
    } else {
      str += 'Will run ';
    }

    // Date
    str += this.getRelativeDay(datetime);

    // Time
    str += ` at ${format(datetime, 'h:mm A')}`;

    return str;
  }

  /** Returns the repeat schedule as a string */
  static repeatAsString(data: SatRepeatSchedule): string {
    if (data.selection === 'none') {
      return 'Does not repeat';
    } else if (data.selection === 'custom') {
      return SatRepeatTranslationUtil.repeat(data.custom);
    } else {
      return 'Repeats every ' + data.selection;
    }
  }

  /** Returns the end schedule as a string */
  static endAsString(data: SatEndSchedule): string {
    if (data.selection === 'never') {
      return 'Never stops';
    }

    if (data.selection === 'date') {
      if (data.date instanceof Date) {
        return `${isPast(data.date) ? 'Stopped' : 'Stops'} ${this.getRelativeDay(data.date)}`;
      }
      throw new Error('Invalid end schedule date');
    }

    if (data.selection === 'count') {
      if (isNaN(data.count) || data.count < 0) {
        throw new Error('Invalid end schedule count');
      }
      return `Runs ${pluralize('time', data.count, true)}`;
    }

    throw new Error('Invalid end schedule');
  }

  /** Returns the date relative to today (tomorrow, yesterday, etc) as string */
  private static getRelativeDay(date: Date, genericPrefix = 'on') {
    if (isTomorrow(date)) {
      return 'tomorrow';
    } else if (isYesterday(date)) {
      return 'yesterday';
    } else if (isToday(date)) {
      return 'today';
    } else {
      return `${genericPrefix} ${format(date, 'M/D/YY')}`;
    }
  }

}
