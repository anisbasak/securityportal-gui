import { SatRepeat, SatRepeatAdjustment, SatRelativeDayOfMonth } from '../models/repeat.model';

export class SatRepeatTranslationUtil {

  static DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  static MONTHS = [
    'January',   'February', 'March',    'April',
    'May',       'June',     'July',     'August',
    'September', 'October',  'November', 'December'
  ];

  /** Translate an entire repeat object into a human-readable string */
  static repeat(cr: SatRepeat): string {

    // Make sure unit is valid
    if (!['day', 'week', 'month', 'year'].includes(cr.unit)) {
      throw new Error('Invalid unit: ' + cr.unit);
    }

    // Make sure frequency is valid
    if (cr.frequency < 1) {
      throw new Error('Invalid frequency: ' + cr.frequency);
    }

    // Make sure adjustment exists for anything except day
    if (cr.unit !== 'day' && !cr.adjustment) {
      throw new Error('Invalid adjustment for: ' + cr.unit);
    }

    let str = 'Repeats every';

    if (cr.frequency === 1) {
      str += ` ${cr.unit}`;
    } else {
      str += ` ${cr.frequency} ${cr.unit}s`;
    }

    // Add the rest depending on cr.unit
    switch (cr.unit) {
      case 'day':
        return str;
      case 'week':
        return str + this.weeklyAdjustment(cr.adjustment);
      case 'month':
        return str + this.monthlyAdjustment(cr.adjustment);
      case 'year':
        return str + this.yearlyAdjustment(cr.adjustment);
      default:
        return str;
    }
  }

  /** Comma separate a list of string, obeying oxford comma rule */
  static oxfordComma(val: string[]): string {
    switch (val.length) {
      case 0:
        return '';
      case 1:
        return val[0];
      case 2:
        return `${val[0]} and ${val[1]}`;
      default:
        return `${val.slice(0, -1).join(', ')}, and ${val.slice(-1)}`;
    }
  }

  /** Return a number as an ordinal string */
  static ordinalSuffix(i: number): string {
    const j = i % 10;
    const k = i % 100;

    if (j === 1 && k !== 11) {
      return i + 'st';
    }

    if (j === 2 && k !== 12) {
      return i + 'nd';
    }

    if (j === 3 && k !== 13) {
      return i + 'rd';
    }

    return i + 'th';
  }

  /** Convert weekly frequency adjustments to a human-readable string */
  private static weeklyAdjustment(adj: SatRepeatAdjustment): string {
    // Array doesn't exist or is empty
    if (!adj.daysOfWeek || !Array.isArray(adj.daysOfWeek) || !adj.daysOfWeek.length) {
      throw new Error('Invalid daysOfWeek');
    }

    // Days are outside range
    const invalidDays = adj.daysOfWeek.filter(x => x < 0 || x > 6);
    if (invalidDays.length) {
      throw new Error('Invalid daysOfWeek: ' + invalidDays.join(', '));
    }

    // Handle every day and only weekday cases
    if (adj.daysOfWeek.length === 7) {
      return ' on every day';
    }

    if (adj.daysOfWeek.length === 5 && !adj.daysOfWeek.includes[0] && !adj.daysOfWeek.includes[6]) {
      return ' on weekdays';
    }

    return ' on ' + this.oxfordComma(this.DAYS.filter((x, i) => adj.daysOfWeek.includes(i)));
  }

  /** Convert monthly frequency adjustments to a human-readable string */
  private static monthlyAdjustment(adj: SatRepeatAdjustment): string {

    const hasExactDays = adj.daysOfMonth
      && Array.isArray(adj.daysOfMonth)
      && adj.daysOfMonth.length;

    const hasRelativeDays = adj.relativeDayOfMonth
      && this.assertValidRelativeDay(adj.relativeDayOfMonth);

    // Throw if has none or both adjustments
    if ((!hasExactDays && !hasRelativeDays) || (hasExactDays && hasRelativeDays)) {
      throw new Error('Invalid adjustment for: month');
    }

    if (hasExactDays) {
      // Days are outside range
      const invalidDays = adj.daysOfMonth.filter(x => x < 1 || x > 31);
      if (invalidDays.length) {
        throw new Error('Invalid daysOfMonth: ' + invalidDays.join(', '));
      }

      const ordinalDays = adj.daysOfMonth.slice().sort((a, b) => a - b).map(this.ordinalSuffix);
      return ' on the ' + this.oxfordComma(ordinalDays);
    } else {
      return ' on the ' + this.relativeDay(adj.relativeDayOfMonth);
    }
  }

  /** Convert yearly frequency adjustments to a human-readable string */
  private static yearlyAdjustment(adj: SatRepeatAdjustment): string {

    const hasMonthsOfYear = adj.monthsOfYear
      && Array.isArray(adj.monthsOfYear)
      && adj.monthsOfYear.length;

    const hasRelativeDays = adj.relativeDayOfMonth
      && this.assertValidRelativeDay(adj.relativeDayOfMonth);

    if (!hasMonthsOfYear) {
      throw new Error('Invalid adjustment for: year');
    }

    const invalidMonths = adj.monthsOfYear.filter(x => x < 0 || x > 11);
    if (invalidMonths.length) {
      throw new Error('Invalid monthsOfYear: ' + invalidMonths.join(', '));
    }

    let str = '';

    if (hasRelativeDays) {
      str += ` on the ${this.relativeDay(adj.relativeDayOfMonth)} of `;
    } else {
      str += ' in ';
    }

    return str + this.oxfordComma(this.MONTHS.filter((x, i) => adj.monthsOfYear.includes(i)));
  }

  /** Convert a relative day adjustment to a string */
  private static relativeDay(rd: SatRelativeDayOfMonth): string {
    let str = '';

    if (rd.relative === -1) {
      str += 'last ';
    } else {
      str += `${this.ordinalSuffix(rd.relative + 1)} `;
    }

    if (this.DAYS.map(x => x.toLowerCase()).includes(rd.type)) {
      // It's a specific day
      str += `${rd.type.charAt(0).toUpperCase()}${rd.type.slice(1)}`;
    } else {
      str += rd.type;
    }

    return str;
  }

  /** Throw errors if a relative day adjustment is invalid */
  private static assertValidRelativeDay(rd: SatRelativeDayOfMonth): boolean {
    const types = [
      ...this.DAYS.map(x => x.toLowerCase()),
      'day',
      'weekday',
      'weekend day'
    ];

    if (!types.includes(rd.type)) {
      throw new Error('Invalid relativeDayOfMonth: ' + rd.type);
    }

    if (rd.relative < -1 || rd.relative > 4) {
      throw new Error('Invalid relativeDayOfMonth: ' + rd.relative);
    }

    return true;
  }
}
