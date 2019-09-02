import { Pipe, PipeTransform } from '@angular/core';

/**
 * @internal
 */
@Pipe({
  name: 'nbspToSpace'
})
export class NbspToSpacePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (typeof value === 'string') {
      return value.replace(/&nbsp;/g, ' ');
    }
    return value;
  }

}
