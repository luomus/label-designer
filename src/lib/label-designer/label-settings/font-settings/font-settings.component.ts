import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IFontStyle } from '../../../label-designer.interface';

/**
 * @internal
 */
@Component({
  selector: 'll-font-settings',
  templateUrl: './font-settings.component.html',
  styleUrls: ['./font-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FontSettingsComponent implements OnInit {

  fontFamily: string[] = [
    'Arial',
    'Arial Black',
    'Courier New',
    'Georgia',
    'Lucida Console',
    'Palatino Linotype',
    'Times New Roman',
    'Verdana',
  ];
  textTransform: string[] = [
    'capitalize',
    'uppercase',
    'lowercase',
  ];
  fontSizes: number[] = [];
  lineHeight: number[] = [
    0.9,
    1,
    1.15,
    1.5,
    1.75,
    2
  ];

  @Input() allowEmptyFontFamily = false;
  @Input() showUnderline = false;
  @Input() minimal = false;
  @Input() fontSettings: IFontStyle;
  @Output() fontSettingsChange = new EventEmitter<IFontStyle>();

  constructor() { }

  ngOnInit() {
    const sizes = [];
    for (let i = 4; i <= 20; i++) {
      sizes.push(i);
    }
    this.fontSizes = sizes;
  }

  change(field: string, value: string|number, forceNumeric = false) {
    if (!value) {
      const result = {};
      const currentSetting = this.fontSettings || {};
      Object.keys(currentSetting).forEach(key => {
        result[key] = key === field ? undefined : currentSetting[key];
      });
      return this.fontSettingsChange.emit(result);
    }
    this.fontSettingsChange.emit({...this.fontSettings, [field]: forceNumeric ? Number(value) : value});
  }

}
