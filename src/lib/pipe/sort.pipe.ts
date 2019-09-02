import { Pipe, PipeTransform } from '@angular/core';

/**
 * @internal
 */
@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: any, property?: string): any {
    if (!Array.isArray(value)) {
      return value;
    }
    const copy = [...value];
    if (!property) {
      return copy.sort();
    }
    return copy.sort((a, b) => (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0));
  }

}
