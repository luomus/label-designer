import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FieldType, ILabelField, ILabelItem, ILabelValueMap, QRCodeErrorCorrectionLevel } from '../../label-designer.interface';
import { LabelService } from '../../label.service';
import { FieldKeyPipe } from '../../pipe/field-key.pipe';

/**
 * @internal
 */
@Component({
  selector: 'll-label-item',
  templateUrl: './label-item.component.html',
  styleUrls: ['../../../styles/ll-label.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelItemComponent {

  _item: ILabelItem;
  _originaleFields: ILabelField[];
  _data: object;
  _map: ILabelValueMap;

  size;
  @Input() qrCodeErrorCorrectionLevel: QRCodeErrorCorrectionLevel = QRCodeErrorCorrectionLevel.levelM;

  constructor(private labelService: LabelService) { }

  @Input()
  set item(item: ILabelItem) {
    this._item = {...item, fields: [...item.fields]};
    this._originaleFields = item.fields;
    this.size = this.labelService.mmToPixel(Math.min(item.style['height.mm'], item.style['width.mm']));
    this.initContent();
  }

  @Input()
  set data(data: object) {
    this._data = data;
    this.initContent();
  }

  @Input()
  set valueMap(map: ILabelValueMap) {
    this._map = map;
    this.initContent();
  }

  private initContent() {
    if (!this._data || !this._item) {
      return;
    }
    const fields: ILabelField[] = [];
    this._originaleFields.forEach(field => {
      if (field.type === FieldType.text) {
        const dataKey = FieldKeyPipe.getKey(field);
        fields.push({
          ...field,
          content: typeof this._data[dataKey] === 'undefined' ? field.content : this._data[dataKey]
        });
      } else if (field.separatorAlways || LabelService.hasValue(this._data[field.field])) {
        fields.push({
          ...field,
          content: LabelService.getFieldValue(field, this._data[field.field], this._map, true) as string
        });
      }
    });
    this._item = {...this._item, fields};
  }
}
