import { SatRepeatTranslationUtil as u } from './repeat-translation.util';

import { SatRepeat, SatRelativeDay } from '../models/repeat.model';


describe('SatRepeatTranslationUtil', () => {

  /** INVALID */
  describe('invalid repeat', () => {
    it('should throw an error when an invalid unit is given', () => {
      const r = {
        unit: 'foobar',
        frequency: 1
      };

      expect(() => u.repeat(r as SatRepeat)).toThrowError('Invalid unit: foobar');
    });

    it('should throw an error when a 0 frequency is given', () => {
      const r: SatRepeat = {
        unit: 'day',
        frequency: 0
      };

      expect(() => u.repeat(r)).toThrowError('Invalid frequency: 0');
    });

    it('should throw an error when an negative frequency is given', () => {
      const r: SatRepeat = {
        unit: 'year',
        frequency: -1
      };

      expect(() => u.repeat(r)).toThrowError('Invalid frequency: -1');
    });
  });


  /** DAYS */
  describe('daily repeat', () => {
    it('should work for every day', () => {
      const r: SatRepeat = {
        unit: 'day',
        frequency: 1
      };

      expect(u.repeat(r)).toEqual('Repeats every day');
    });

    it('should work for some days', () => {
      const r: SatRepeat = {
        unit: 'day',
        frequency: 15
      };

      expect(u.repeat(r)).toEqual('Repeats every 15 days');
    });

    it('should work for some days with invalid adjustment', () => {
      const r: SatRepeat = {
        unit: 'day',
        frequency: 15,
        adjustment: {
          daysOfWeek: [0, 1, 4]
        }
      };

      expect(u.repeat(r)).toEqual('Repeats every 15 days');
    });
  });


  /** WEEKS */
  describe('weekly repeat', () => {
    it('should work for every week', () => {
      const r: SatRepeat = {
        unit: 'week',
        frequency: 1,
        adjustment: { daysOfWeek: [0] }
      };

      expect(u.repeat(r)).toEqual('Repeats every week on Sunday');
    });

    it('should work for some weeks', () => {
      const r: SatRepeat = {
        unit: 'week',
        frequency: 3,
        adjustment: { daysOfWeek: [1] }
      };

      expect(u.repeat(r)).toEqual('Repeats every 3 weeks on Monday');
    });

    it('should work for every week on multiple days', () => {
      const r: SatRepeat = {
        unit: 'week',
        frequency: 1,
        adjustment: { daysOfWeek: [0, 4] }
      };

      expect(u.repeat(r)).toEqual('Repeats every week on Sunday and Thursday');
    });

    it('should work for every week on multiple unsorted days', () => {
      const r: SatRepeat = {
        unit: 'week',
        frequency: 1,
        adjustment: { daysOfWeek: [4, 0] }
      };

      expect(u.repeat(r)).toEqual('Repeats every week on Sunday and Thursday');
      expect(r.adjustment.daysOfWeek).toEqual([4, 0], 'Expected to not mutate array');
    });

    it('should work for every week on every day', () => {
      const r: SatRepeat = {
        unit: 'week',
        frequency: 1,
        adjustment: { daysOfWeek: [0, 1, 2, 3, 4, 5, 6] }
      };

      expect(u.repeat(r)).toEqual('Repeats every week on every day');
    });

    it('should work for every week on every weekday', () => {
      const r: SatRepeat = {
        unit: 'week',
        frequency: 1,
        adjustment: { daysOfWeek: [1, 2, 3, 4, 5] }
      };

      expect(u.repeat(r)).toEqual('Repeats every week on weekdays');
    });

    it('should work for some weeks on every day', () => {
      const r: SatRepeat = {
        unit: 'week',
        frequency: 3,
        adjustment: { daysOfWeek: [0, 1, 2, 3, 4, 5, 6] }
      };

      expect(u.repeat(r)).toEqual('Repeats every 3 weeks on every day');
    });

    it('should work for some weeks on every weekday', () => {
      const r: SatRepeat = {
        unit: 'week',
        frequency: 4,
        adjustment: { daysOfWeek: [1, 2, 3, 4, 5] }
      };

      expect(u.repeat(r)).toEqual('Repeats every 4 weeks on weekdays');
    });

    it('should throw with an invalid adjustment', () => {
      const r: SatRepeat = {
        unit: 'week',
        frequency: 1,
        adjustment: { daysOfMonth: [1, 2, 3]}
      };

      expect(() => u.repeat(r)).toThrowError('Invalid daysOfWeek');

      delete r.adjustment;

      expect(() => u.repeat(r)).toThrowError('Invalid adjustment for: week');
    });

    it('should throw with a invalid days of week', () => {
      const r: SatRepeat = {
        unit: 'week',
        frequency: 1,
        adjustment: { daysOfWeek: [-1, 7]}
      };
      expect(() => u.repeat(r)).toThrowError('Invalid daysOfWeek: -1, 7');

      r.adjustment.daysOfWeek = [0, 1, 7];
      expect(() => u.repeat(r)).toThrowError('Invalid daysOfWeek: 7');

      r.adjustment.daysOfWeek = [];
      expect(() => u.repeat(r)).toThrowError('Invalid daysOfWeek');
    });

  });


  /** MONTHS */
  describe('monthly repeat', () => {
    it('should work for every month', () => {
      const r: SatRepeat = {
        unit: 'month',
        frequency: 1,
        adjustment: { daysOfMonth: [2] }
      };

      expect(u.repeat(r)).toEqual('Repeats every month on the 2nd');
    });

    it('should work for some months', () => {
      const r: SatRepeat = {
        unit: 'month',
        frequency: 4,
        adjustment: { daysOfMonth: [1] }
      };

      expect(u.repeat(r)).toEqual('Repeats every 4 months on the 1st');
    });

    it('should work for some months on exact days', () => {
      const r: SatRepeat = {
        unit: 'month',
        frequency: 4,
        adjustment: { daysOfMonth: [1, 4, 17] }
      };

      expect(u.repeat(r)).toEqual('Repeats every 4 months on the 1st, 4th, and 17th');
    });

    it('should work for some months on unsorted exact days', () => {
      const r: SatRepeat = {
        unit: 'month',
        frequency: 4,
        adjustment: { daysOfMonth: [4, 17, 1] }
      };

      expect(u.repeat(r)).toEqual('Repeats every 4 months on the 1st, 4th, and 17th');
      expect(r.adjustment.daysOfMonth).toEqual([4, 17, 1], 'Expected to not mutate array');
    });

    it('should work for every month on relative days', () => {
      const r: SatRepeat = {
        unit: 'month',
        frequency: 1,
        adjustment: {
          relativeDayOfMonth: { relative: 0, type: 'weekend day' }
        }
      };

      expect(u.repeat(r)).toEqual('Repeats every month on the 1st weekend day');
    });

    it('should throw an error for conflicting adjustments', () => {
      const r: SatRepeat = {
        unit: 'month',
        frequency: 2,
        adjustment: {
          relativeDayOfMonth: { relative: 4, type: 'saturday' },
          daysOfMonth: [27]
        }
      };

      expect(() => u.repeat(r)).toThrowError('Invalid adjustment for: month');
    });

    it('should throw an error when no proper adjustment is provided', () => {
      const r: SatRepeat = {
        unit: 'month',
        frequency: 1
      };

      expect(() => u.repeat(r)).toThrowError('Invalid adjustment for: month');
    });

    it('should throw an error when an invalid day of month is provided', () => {
      const r: SatRepeat = {
        unit: 'month',
        frequency: 1,
        adjustment: { daysOfMonth: [0] }
      };

      expect(() => u.repeat(r)).toThrowError('Invalid daysOfMonth: 0');

      r.adjustment.daysOfMonth = [1, 34, 51];
      expect(() => u.repeat(r)).toThrowError('Invalid daysOfMonth: 34, 51');
    });

    it('should throw an error when an invalid relative day is provided', () => {
      const r: SatRepeat = {
        unit: 'month',
        frequency: 1,
        adjustment: {
          relativeDayOfMonth: { relative: -2, type: 'saturday' }
        }
      };
      expect(() => u.repeat(r)).toThrowError('Invalid relativeDayOfMonth: -2');

      r.adjustment.relativeDayOfMonth.relative = 5;
      expect(() => u.repeat(r)).toThrowError('Invalid relativeDayOfMonth: 5');

      r.adjustment.relativeDayOfMonth = { relative: 0, type: 'foo' as SatRelativeDay };
      expect(() => u.repeat(r)).toThrowError('Invalid relativeDayOfMonth: foo');
    });
  });


  /** YEARS */
  describe('yearly repeat', () => {
    it('should work for every year', () => {
      const r: SatRepeat = {
        unit: 'year',
        frequency: 1,
        adjustment: { monthsOfYear: [0] }
      };

      expect(u.repeat(r)).toEqual('Repeats every year in January');
    });

    it('should work for some years', () => {
      const r: SatRepeat = {
        unit: 'year',
        frequency: 2,
        adjustment: { monthsOfYear: [0] }
      };

      expect(u.repeat(r)).toEqual('Repeats every 2 years in January');
    });

    it('should work for some years on wtih 2 specific months', () => {
      const r: SatRepeat = {
        unit: 'year',
        frequency: 3,
        adjustment: { monthsOfYear: [0, 11] }
      };

      expect(u.repeat(r)).toEqual('Repeats every 3 years in January and December');
    });

    it('should work for every year on several specific months', () => {
      const r: SatRepeat = {
        unit: 'year',
        frequency: 1,
        adjustment: { monthsOfYear: [0, 4, 11] }
      };

      expect(u.repeat(r)).toEqual('Repeats every year in January, May, and December');
    });

    it('should work for every year on several specific unsorted months', () => {
      const r: SatRepeat = {
        unit: 'year',
        frequency: 1,
        adjustment: { monthsOfYear: [4, 0, 11] }
      };

      expect(u.repeat(r)).toEqual('Repeats every year in January, May, and December');
      expect(r.adjustment.monthsOfYear).toEqual([4, 0, 11], 'Expected to not mutate array');
    });

    it('should work for every year with relative days of month', () => {
      const r: SatRepeat = {
        unit: 'year',
        frequency: 1,
        adjustment: {
          monthsOfYear: [0],
          relativeDayOfMonth: { relative: -1, type: 'friday' }
        }
      };

      expect(u.repeat(r)).toEqual('Repeats every year on the last Friday of January');
    });

    it('should work for every year with relative days of several months', () => {
      const r: SatRepeat = {
        unit: 'year',
        frequency: 1,
        adjustment: {
          monthsOfYear: [0, 9],
          relativeDayOfMonth: { relative: 3, type: 'tuesday' }
        }
      };

      expect(u.repeat(r)).toEqual('Repeats every year on the 4th Tuesday of January and October');
    });

    it('should throw an error for every year with no monthsOfYear adjustment', () => {
      const r: SatRepeat = {
        unit: 'year',
        frequency: 1,
        adjustment: { relativeDayOfMonth: { relative: 0, type: 'day' } }
      };

      expect(() => u.repeat(r)).toThrowError('Invalid adjustment for: year');
    });

    it('should throw an error for every year with invalid month', () => {
      const r: SatRepeat = {
        unit: 'year',
        frequency: 1,
        adjustment: { monthsOfYear: [12] }
      };
      expect(() => u.repeat(r)).toThrowError('Invalid monthsOfYear: 12');

      r.adjustment.monthsOfYear = [-1, 2];
      expect(() => u.repeat(r)).toThrowError('Invalid monthsOfYear: -1');
    });

  });

  /** OXFORD COMMA */
  describe('oxford comma', () => {
    it('should work for 1 month', () => {
      const a = ['January'];
      expect(u.oxfordComma(a)).toEqual('January');
    });

    it('should work for 2 months', () => {
      const a = ['January', 'May'];
      expect(u.oxfordComma(a)).toEqual('January and May');
    });

    it('should work for 3+ months', () => {
      const a = ['January', 'May', 'October'];
      const b = ['January', 'March', 'May', 'October', 'December'];
      expect(u.oxfordComma(a)).toEqual('January, May, and October');
      expect(u.oxfordComma(b)).toEqual('January, March, May, October, and December');
    });

    it('should work for other strings', () => {
      const a = ['2nd'];
      const b = ['1st', '5th', '12th'];
      expect(u.oxfordComma(a)).toEqual('2nd');
      expect(u.oxfordComma(b)).toEqual('1st, 5th, and 12th');
    });

  });

  /** ORDINAL SUFFIX */
  describe('ordinal suffix', () => {
    it('should work', () => {
      expect(u.ordinalSuffix(0)).toEqual('0th');
      expect(u.ordinalSuffix(1)).toEqual('1st');
      expect(u.ordinalSuffix(2)).toEqual('2nd');
      expect(u.ordinalSuffix(3)).toEqual('3rd');
      expect(u.ordinalSuffix(4)).toEqual('4th');

      expect(u.ordinalSuffix(11)).toEqual('11th');
      expect(u.ordinalSuffix(12)).toEqual('12th');
      expect(u.ordinalSuffix(13)).toEqual('13th');
      expect(u.ordinalSuffix(14)).toEqual('14th');

      expect(u.ordinalSuffix(21)).toEqual('21st');
      expect(u.ordinalSuffix(22)).toEqual('22nd');
      expect(u.ordinalSuffix(23)).toEqual('23rd');
      expect(u.ordinalSuffix(24)).toEqual('24th');

      expect(u.ordinalSuffix(111)).toEqual('111th');
    });
  });

});
