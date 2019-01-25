import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'resource'
})
export class ResourcePipe implements PipeTransform {

  transform(input: any) {
    if (input && input.name && input._id) {
      return input.name;
    }
    return input.name || input;
  }
}
