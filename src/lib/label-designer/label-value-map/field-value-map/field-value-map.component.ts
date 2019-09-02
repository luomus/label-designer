import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * @internal
 */
@Component({
  selector: 'll-field-value-map',
  templateUrl: './field-value-map.component.html',
  styleUrls: ['./field-value-map.component.scss']
})
export class FieldValueMapComponent {

  @Input() field: string;
  @Input() title: string;
  @Input() mapping: {[value: string]: string};

  @Output() mappingChange = new EventEmitter<{[value: string]: string}>();
  @Output() remove = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  open = false;


  addNew() {
    this.mappingChange.emit({
      ...this.mapping,
      '': ''
    });
  }

  changeKey(oldKey: string, newKey: string) {
    const result = {};
    Object.keys(this.mapping).forEach(key => result[oldKey === key ? newKey : key] = this.mapping[key]);
    this.mappingChange.emit(result);
  }

  changeValue(key: string, value: any) {
    this.mappingChange.emit({
      ...this.mapping,
      [key]: value
    });
  }

  removeKey(key: string) {
    const { [key]: value, ...mapping } = this.mapping;
    this.mappingChange.emit(mapping);
  }
}
