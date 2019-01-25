import { Pipe, PipeTransform } from '@angular/core';
import _escapeRegExp from 'lodash-es/escapeRegExp';

type PatternFn = (val: string) => string;

@Pipe({
  name: 'bold'
})
export class BoldPipe implements PipeTransform {

   transform(text: string, search: string, pattern: string | PatternFn, flags: string): string {

    if (!search || !text) {
      return text;
    } else {
      // Set default regex pattern (call function if pattern is a function)
      pattern = pattern ? pattern : _escapeRegExp;
      pattern = typeof pattern === 'function' ? pattern(search) : pattern;

      // Set default regex flags
      flags = flags ? flags : 'gi';

      // Create regex
      const regex = new RegExp(pattern, flags);

      // Replace regex matches with themselves wrapped in bold tags
      return text.replace(regex, match => `<b>${match}</b>`);
    }
  }
}
