import { Pipe, PipeTransform } from '@angular/core';

/**
 * @internal
 */
@Pipe({
  name: 'removeSuffix'
})
export class RemoveSuffixPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (typeof value === 'string') {
      const parts = value.split('.');
      parts.pop();
      return parts.join('.');
    }
    return value;
  }

}
