import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
import { ILabelItem, ILabelStyle, ISetup, TLabelLocation } from '../../label-designer.interface';
import { LabelService } from '../../label.service';
import { TranslateService } from '../../translate/translate.service';
import { LabelMakerFacade } from '../label-maker.facade';

/**
 * @internal
 */
@Component({
  selector: 'll-label-editor',
  templateUrl: './label-editor.component.html',
  styleUrls: ['./label-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelEditorComponent {

  _setup: ISetup;
  _magnification = 2;
  _magnifiedStyle: ILabelStyle;
  init = false;
  minSize = 10;

  @Input() grid: number;
  @Input() gridVisible: boolean;
  @Input() active: ILabelItem;
  @Input() backSide = false;
  @Output() activeChange = new EventEmitter<ILabelItem>();
  @Output() setupChange = new EventEmitter<ISetup>();
  @Output() showSettings = new EventEmitter<ILabelItem>();
  @Output() done = new EventEmitter<void>();

  constructor(
    private labelService: LabelService,
    private translateService: TranslateService,
    private labelMakerFacade: LabelMakerFacade
  ) {
    this.init = labelService.hasRation();
  }

  @Input()
  set setup(setup: ISetup) {
    this._setup = setup;
    this.recalculate();
  }

  @Input()
  set magnification(mag: number) {
    this._magnification = mag;
    this.recalculate();
  }

  recalculate() {
    if (!this._setup) {
      return;
    }
    const resultStyle = {};
    Object.keys(this._setup.label).forEach(prop => {
      if (typeof this._setup.label[prop] === 'number' && prop !== 'line-height') {
        resultStyle[prop] = this._setup.label[prop] * this._magnification;
      } else {
        resultStyle[prop] = this._setup.label[prop];
      }
    });
    this._magnifiedStyle = resultStyle;
  }

  onItemChange(originalItem: ILabelItem, newItem: ILabelItem) {
    const result = [];
    const items: TLabelLocation = this.backSide ? 'backSideLabelItems' : 'labelItems';
    this._setup[items].forEach(item => {
      result.push(item === originalItem ? newItem : item);
    });
    this._setup = {
      ...this._setup,
      [items]: result
    };
    this.setupChange.emit(this._setup);
    console.log('MARKING AS HAVING CHANGES');
    this.labelMakerFacade.hasChanges(true);
  }

  updateDimensions(event: Event, target: string, sec: 'page'|'label') {
    const element = event.target as HTMLInputElement;
    const value = Number(element.value);
    const {width, height} = this.labelService.countMinLabelSize(this._setup);
    if ((target === 'height.mm' && value < height) || (target === 'width.mm' && value < width)) {
      element.value = '' + this._setup[sec][target];
      return alert(this.translateService.get('Field within the label is blocking the resize!'));
    }
    if (value < this.minSize) {
      element.value = '' + this._setup[sec][target];
      return alert(this.translateService.get('Cannot make labels smaller than {{size}}mm!', {size: this.minSize}));
    }

    this._setup = {
      ...this._setup,
      [sec]: {
        ...this._setup[sec],
        [target]: value
      }
    };
    this.setupChange.emit(this._setup);
  }

  setActiveItem(item: ILabelItem) {
    this.activeChange.emit(item);
  }
}
