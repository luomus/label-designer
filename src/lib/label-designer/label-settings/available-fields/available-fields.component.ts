import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldType, ILabelField } from '../../../label-designer.interface';

/**
 * @internal
 */
@Component({
  selector: 'll-available-fields',
  templateUrl: './available-fields.component.html',
  styleUrls: ['./available-fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailableFieldsComponent {

  @Input() includePseudoFields = true;
  @Input() placeholder = 'add';
  @Input() availableFields: ILabelField[];
  @Input() value = '';

  @Output() valueChange = new EventEmitter<ILabelField>();

  fieldType = FieldType;

  doValueSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    select.value = '';
    const idx = this.availableFields.findIndex((v) => v.field === value);
    if (idx > -1) {
      this.valueChange.emit({...this.availableFields[idx]});
    } else {
      this.valueChange.emit(null);
    }
  }
}
