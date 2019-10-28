import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ILabelField, ILabelValueMap } from '../../label-designer.interface';
import { LabelService } from '../../label.service';
import { TranslateService } from '../../translate/translate.service';

/**
 * @internal
 */
@Component({
  selector: 'll-label-value-map',
  templateUrl: './label-value-map.component.html',
  styleUrls: ['./label-value-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelValueMapComponent {

  @Input() data: object[];

  fieldLookup: {[field: string]: ILabelField} = {};
  addableFields: ILabelField[] = [];
  mapped: string[] = [];

  @Output() valueMapChange = new EventEmitter<ILabelValueMap>();

  private _map: ILabelValueMap = {};
  private _availableFields: ILabelField[];

  constructor(private translateService: TranslateService) {}


  @Input()
  set availableFields(fields: ILabelField[]) {
    this._availableFields = fields;
    if (Array.isArray(fields)) {
      const lookup = {};
      fields.forEach(field => lookup[field.field] = field);
      this.fieldLookup = lookup;
    }
    this.initAddableFields();
  }

  @Input()
  set valueMap(map: ILabelValueMap) {
    this._map = map;
    this.mapped = map ? Object.keys(map) : [];
    this.initAddableFields();
  }

  get valueMap()  {
    return this._map;
  }

  updateFieldMap(field: string, map: {[value: string]: string}) {
    this.valueMapChange.emit({
      ...this._map,
      [field]: map
    });
  }

  addNewField(field: ILabelField) {
    if (!field) {
      return;
    }
    let fieldMap = {};
    if (this.data) {
      fieldMap = this.addByData(field);
    }
    if (field.valueMap && Object.keys(fieldMap).length === 0) {
      Object.keys(field.valueMap).forEach(key => {
        if (field.valueMap[key]) {
          fieldMap[field.valueMap[key]] = '';
        }
      });
    }
    this.updateFieldMap(field.field, fieldMap);
  }

  removeFromMap(field: string) {
    if (!this._map[field] || !confirm(this.translateService.get('Are you sure that you want to remove this?'))) {
      return;
    }
    const { [field]: value, ...mapping } = this._map;
    this.valueMapChange.emit(mapping);
  }

  addMappingByField(field: string) {
    if (this.fieldLookup[field]) {
      this.updateFieldMap(field, this.addByData(this.fieldLookup[field], this._map[field] || {}));
    }
  }

  addByData(field: ILabelField, map = {}) {
    const base = {...map};
    const values = new Set();
    this.data.forEach((row) => {
      if (LabelService.hasValue(row[field.field])) {
        const rowValue = LabelService.getDefaultFieldValue(field, row[field.field], false);
        if (Array.isArray(rowValue)) {
          rowValue.forEach(v => values.add(v));
        } else {
          values.add(rowValue);
        }
      }
    });
    values.forEach(v => {
      if (typeof base[v] === 'undefined') {
        base[v] = '';
      }
    });
    return base;
  }

  private initAddableFields() {
    if (!this._availableFields) {
      return;
    }
    this.addableFields = this._map ? this._availableFields.filter(field => !this._map[field.field]) : this._availableFields;
  }
}
