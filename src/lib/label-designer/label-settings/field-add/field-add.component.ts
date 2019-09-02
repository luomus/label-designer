import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldType, ILabelField } from '../../../label-designer.interface';

/**
 * @internal
 */
@Component({
  selector: 'll-field-add',
  templateUrl: './field-add.component.html',
  styleUrls: ['./field-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldAddComponent {

  @Input() availableFields: ILabelField[];

  @Output() add = new EventEmitter<ILabelField>();

  fieldType = FieldType;


  doAdd(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    select.value = '';
    const idx = this.availableFields.findIndex((v) => v.field === value);
    if (idx > -1) {
      this.add.emit({...this.availableFields[idx]});
    }
  }
}
