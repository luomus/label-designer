import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FieldType, IFontStyle, ILabelField, QRCodeErrorCorrectionLevel } from '../../../label-designer.interface';

/**
 * @internal
 */
@Component({
  selector: 'll-label-item-field',
  templateUrl: './label-item-field.component.html',
  styleUrls: ['./label-item-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelItemFieldComponent {

  _field: ILabelField;

  @Input() isLast = false;
  @Input() size: number;
  @Input() qrCodeErrorCorrectionLevel: QRCodeErrorCorrectionLevel = QRCodeErrorCorrectionLevel.levelM;

  _prefixStyle: IFontStyle;
  _contentStyle: IFontStyle;
  _suffixStyle: IFontStyle;

  fieldType = FieldType;

  @Input()
  set field(field: ILabelField) {
    this._field = field;
    const empty = {};
    switch (this._field.styleAppliesTo) {
      case 'prefix':
        this._prefixStyle = this._field.style;
        this._contentStyle = empty;
        this._suffixStyle = empty;
        break;
      case 'content':
        this._prefixStyle = empty;
        this._contentStyle = this._field.style;
        this._suffixStyle = empty;
        break;
      case 'suffix':
        this._prefixStyle = empty;
        this._contentStyle = empty;
        this._suffixStyle = this._field.style;
        break;
      case 'contentPrefix':
        this._prefixStyle = this._field.style;
        this._contentStyle = this._field.style;
        this._suffixStyle = empty;
        break;
      case 'contentSuffix':
        this._prefixStyle = empty;
        this._contentStyle = this._field.style;
        this._suffixStyle = this._field.style;
        break;
      case 'prefixSuffix':
        this._prefixStyle = this._field.style;
        this._contentStyle = empty;
        this._suffixStyle = this._field.style;
        break;
      default:
        this._prefixStyle = this._field.style;
        this._contentStyle = this._field.style;
        this._suffixStyle = this._field.style;
        break;
    }
  }

}
