import { SatScheduleTranslationUtil as util } from './schedule-translation.util';
import * as addDays from 'date-fns/add_days';

import {
  SatStartSchedule,
  SatRepeatSchedule,
  SatEndSchedule
} from '../models/schedule.model';

describe('SatScheduleTranslationUtil', () => {

  describe('startAsString', () => {
    it('should display a long-ago past datetime correctly', () => {
      const start: SatStartSchedule = {
        enabled: true,
        date: new Date(2011, 0, 1),
        time: '09:00'
      };

      expect(util.startAsString(start)).toEqual('Ran on 1/1/11 at 9:00 AM');
    });

    it('should display a yesterday datetime correctly', () => {
      const yesterday = addDays(new Date(), -1);
      const start: SatStartSchedule = {
        enabled: true,
        date: yesterday,
        time: '09:00'
      };

      expect(util.startAsString(start)).toEqual('Ran yesterday at 9:00 AM');
    });

    it('should display a tomorrow datetime correctly', () => {
      const tomorrow = addDays(new Date(), 1);
      const start: SatStartSchedule = {
        enabled: true,
        date: tomorrow,
        time: '22:00'
      };

      expect(util.startAsString(start)).toEqual('Will run tomorrow at 10:00 PM');
    });

    it('should display a far future datetime correctly', () => {
      const start: SatStartSchedule = {
        enabled: true,
        date: new Date(5555, 11, 21),
        time: '17:59'
      };

      expect(util.startAsString(start)).toEqual('Will run on 12/21/55 at 5:59 PM');
    });
  });

  describe('repeatAsString', () => {
    it('should display no repeat correctly', () => {
      const repeat: SatRepeatSchedule = { selection: 'none', custom: null };
      expect(util.repeatAsString(repeat)).toEqual('Does not repeat');
    });

    it('should display daily repeat correctly', () => {
      const repeat: SatRepeatSchedule = { selection: 'day', custom: null };
      expect(util.repeatAsString(repeat)).toEqual('Repeats every day');
    });
  });

  describe('endAsString', () => {
    it('should display no end date correctly', () => {
      const end: SatEndSchedule = {
        selection: 'never'
      };

      expect(util.endAsString(end)).toEqual('Never stops');
    });

    it('should display a past end date correctly', () => {
      const end: SatEndSchedule = {
        selection: 'date',
        date: new Date(2011, 7, 13)
      };

      expect(util.endAsString(end)).toEqual('Stopped on 8/13/11');
    });

    it('should display a future end date correctly', () => {
      const end: SatEndSchedule = {
        selection: 'date',
        date: new Date(5554, 7, 13)
      };

      expect(util.endAsString(end)).toEqual('Stops on 8/13/54');
    });

    it('should display a yesterday end date correctly', () => {
      const yesterday = addDays(new Date(), -1);
      const end: SatEndSchedule = {
        selection: 'date',
        date: yesterday
      };

      expect(util.endAsString(end)).toEqual('Stopped yesterday');
    });

    it('should display a tomorrow end date correctly', () => {
      const tomorrow = addDays(new Date(), 1);
      const end: SatEndSchedule = {
        selection: 'date',
        date: tomorrow
      };

      expect(util.endAsString(end)).toEqual('Stops tomorrow');
    });

    it('should display an end count correctly', () => {
      const end: SatEndSchedule = {
        selection: 'count',
        count: 1
      };

      expect(util.endAsString(end)).toEqual('Runs 1 time', 'singular');

      end.count = 0;
      expect(util.endAsString(end)).toEqual('Runs 0 times', 'zero');

      end.count = 15;
      expect(util.endAsString(end)).toEqual('Runs 15 times', 'plural');
    });

    it('should throw when an end count is negative', () => {
      const end: SatEndSchedule = {
        selection: 'count',
        count: -1
      };

      expect(() => util.endAsString(end)).toThrowError('Invalid end schedule count');
    });

    it('should throw when an end date is invalid', () => {
      const end = {
        selection: 'date',
        date: {}
      } as SatEndSchedule;

      expect(() => util.endAsString(end)).toThrowError('Invalid end schedule date');
    });

    it('should throw when an invalid end schedule is provided', () => {
      const end: SatEndSchedule = {
        selection: 'count',
        date: new Date(5554, 7, 13)
      };

      expect(() => util.endAsString(end)).toThrowError('Invalid end schedule count');

      end.selection = 'date';
      expect(() => util.endAsString(end)).not.toThrow();
    });

  });

});
