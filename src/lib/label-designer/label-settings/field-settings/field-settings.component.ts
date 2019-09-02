import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldType, ILabelField } from '../../../label-designer.interface';

/**
 * @internal
 */
@Component({
  selector: 'll-field-settings',
  templateUrl: './field-settings.component.html',
  styleUrls: ['./field-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldSettingsComponent {

  @Input() field: ILabelField;
  @Input() allowDelete: boolean;
  @Output() fieldChange = new EventEmitter<ILabelField>();
  @Output() fieldRemove = new EventEmitter<void>();

  more = false;
  fieldType = FieldType;

  separators: {sep: string, label?: string}[] = [
    {sep: ', '},
    {sep: '. '},
    {sep: '-'},
    {sep: ' - ', label: '&nbsp;-'},
    {sep: '&ndash;'},
    {sep: ' &ndash; ', label: '&nbsp;&ndash;'},
    {sep: '&mdash;'},
    {sep: ' &mdash; ', label: '&nbsp;&mdash;'},
    {sep: ': '},
    {sep: '; '},
    {sep: ' & ', label: '&nbsp;&'},
    {sep: ' ', label: 'space'},
    {sep: '<br>', label: 'new line'},
    {sep: '', label: 'none'},
  ];

  onChange(event: Event, place = 'separator') {
    const select = event.target as HTMLSelectElement;
    this.change(select.value, place);
  }

  change(value, place = 'separator') {
    this.fieldChange.emit({
      ...this.field,
      [place]: value,
      _menuOpen: this.more || this.field._menuOpen
    });
  }

  remove() {
    if (confirm('Are you sure that you want to remove "' + this.field.label + '"')) {
      this.fieldRemove.emit();
    }
  }

  textFieldChanged(event: Event) {
    const element = event.target as HTMLInputElement;
    this.fieldChange.emit({
      ...this.field,
      label: element.value,
      content: element.value
    });
  }

  toggleMore() {
    this.more = !(this.more || this.field._menuOpen);
    delete this.field._menuOpen;
  }

  userInput(event: Event, place: string) {
    const element = event.target as HTMLInputElement;
    this.change(element.value.replace(/ /g, '&nbsp;'), place);
  }
}
