import { SatSchedule } from '../models/schedule.model';

export class SatScheduleConversionUtil {

  /** Converts all SatSchedule dates that are strings into Date objects */
  static parseStringsAsDates(data: SatSchedule): SatSchedule {
    if (!data) {
      return data;
    }

    if (data.start && data.start.date && typeof data.start.date === 'string') {
      data.start.date = new Date(data.start.date);
    }

    if (data.end && data.end.date && typeof data.end.date === 'string') {
      data.end.date = new Date(data.end.date);
    }

    return data;
  }

}
