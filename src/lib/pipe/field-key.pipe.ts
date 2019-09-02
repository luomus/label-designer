import { Pipe, PipeTransform } from '@angular/core';
import { ILabelField } from '../label-designer.interface';

/**
 * @internal
 */
@Pipe({
  name: 'fieldKey'
})
export class FieldKeyPipe implements PipeTransform {

  static getKey(value: ILabelField) {
    return value.type === 'text' ? ':' + value.label : value.field;
  }

  transform(value: ILabelField): any {
    if (!value) {
      return '';
    }
    return FieldKeyPipe.getKey(value);
  }

}
