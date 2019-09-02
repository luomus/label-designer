import { Pipe, PipeTransform } from '@angular/core';

const DEFAULT_SEPARATOR = ', ';

/**
 * @internal
 */
@Pipe({
  name: 'separator'
})
export class SeparatorPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (typeof value === 'undefined' || value === null) {
      return DEFAULT_SEPARATOR;
    }
    return value;
  }

}
