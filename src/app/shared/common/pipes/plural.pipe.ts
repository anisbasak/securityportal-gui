import { Pipe, PipeTransform } from '@angular/core';
import * as pluralize from 'pluralize';

@Pipe({
  name: 'plural'
})
export class PluralPipe implements PipeTransform {

  transform(value: string, count: number) {
    if (typeof value !== 'string') {
      return '';
    }

    if (count !== undefined) {
      return pluralize(value, count, true);
    }
    return pluralize.plural(value);
  }
}
