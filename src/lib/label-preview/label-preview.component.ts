import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ILabelItem, ILabelStyle, ISetup, QRCodeErrorCorrectionLevel } from '../label-designer.interface';
import { LabelService } from '../label.service';

/**
 * Display preview of the label.
 *
 * This can be used to preview the actual label with real data. There can be multiple previews visible at the same time
 * so that front and backside can be displayed at the same time.
 *
 * @example
 * <ll-label-preview
 *             [setup]="setup"
 *             [data]="{id: 'JA.123', species: 'Parus major', 'gathering.begin': '2019-01-01', 'gathering.end': '2019-01-31'}">
 * </ll-label-preview>
 * <ll-label-preview
 *             [backside]="true"
 *             [setup]="setup"
 *             [data]="{id: 'JA.123', species: 'Parus major', 'gathering.begin': '2019-01-01', 'gathering.end': '2019-01-31'}">
 * </ll-label-preview>
 */
@Component({
  selector: 'll-label-preview',
  templateUrl: './label-preview.component.html',
  styleUrls: ['../../styles/ll-label.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelPreviewComponent implements OnChanges {

  /**
   * @ignore
   */
  @Input() preview = true;

  /**
   * Object that holds the key value data used on the label.
   */
  @Input() data: object;

  /**
   * Show preview using backside label items.
   */
  @Input() backside = false;

  /**
   * Error correction level used on the QR Code.
   */
  @Input() qrCodeErrorCorrectionLevel: QRCodeErrorCorrectionLevel = QRCodeErrorCorrectionLevel.levelM;

  /**
   * @ignore
   */
  items: ILabelItem[] = [];
  /**
   * @ignore
   */
  labelStyle: ILabelStyle;
  /**
   * @ignore
   */
  init;

  /**
   * Setup used in the label.
   */
  @Input() setup: ISetup;

  /**
   * @ignore
   */
  constructor(labelService: LabelService) {
    this.init = labelService.hasRation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['setup'] || changes['backside']) {
      this.initStyle();
    }
  }

  private initStyle() {
    if (!this.setup) {
      return;
    }
    const style = {...this.setup.label};
    if (this.backside) {
      this.items = this.setup.backSideLabelItems;
      const swp = style['marginLeft.mm'];
      style['marginLeft.mm'] = style['marginRight.mm'];
      style['marginRight.mm'] = swp;
    } else {
      this.items = this.setup.labelItems;
    }
    this.labelStyle = style;
  }
}
