import { Pipe, PipeTransform } from '@angular/core';
import { ILabelField } from '../../label-designer.interface';

/**
 * @internal
 */
@Pipe({
  name: 'searchFields'
})
export class SearchFieldsPipe implements PipeTransform {

  transform(value: ILabelField[], args?: string): any {
    if (!args) {
      return value;
    }
    const upperSearch = args.toLocaleLowerCase();
    return value.filter(val => val.label.toLocaleLowerCase().indexOf(upperSearch) !== -1);
  }

}
