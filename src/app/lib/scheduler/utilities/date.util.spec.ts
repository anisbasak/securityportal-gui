import { DateUtil as util } from './date.util';
import * as parse from 'date-fns/parse';


describe('DateUtil', () => {

  describe('mergeDateAndTime', () => {
    it('should remove late time and replace with new AM time', () => {
      // 4th month is May
      const date = new Date(2017, 4, 17, 23, 15, 15);
      const time = '02:42';
      expect(util.mergeDateAndTime(date, time).toISOString())
        .toEqual(parse('2017-05-17T02:42').toISOString());
    });

    it('should remove early time and replace with new PM time', () => {
      const date = new Date(2017, 4, 17, 1, 2, 3);
      const time = '23:11';
      expect(util.mergeDateAndTime(date, time).toISOString())
        .toEqual(parse('2017-05-17T23:11').toISOString());
    });

    it('should work with a full time', () => {
      const date = new Date(2017, 7, 7, 4, 0, 0, 0);
      const time = '12:51:19';
      expect(util.mergeDateAndTime(date, time).toISOString())
        .toEqual(parse('2017-08-07T12:51:19').toISOString());
    });
  });

});
