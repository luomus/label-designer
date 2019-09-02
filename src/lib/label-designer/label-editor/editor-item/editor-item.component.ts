import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FieldType, ILabelItem } from '../../../label-designer.interface';
import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { LabelService } from '../../../label.service';
import { TranslateService } from '../../../translate/translate.service';

/**
 * @internal
 */
@Component({
  selector: 'll-editor-item',
  templateUrl: './editor-item.component.html',
  styleUrls: ['./editor-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorItemComponent implements AfterViewInit {

  @Input() active: boolean;
  @Input() boundary = '#label-editor';
  @Output() done = new EventEmitter<void>();
  @Output() itemChange = new EventEmitter<ILabelItem>();

  @Output() showSettings = new EventEmitter<ILabelItem>();
  @Output() itemClick = new EventEmitter<ILabelItem>();

  @ViewChild('item', { static: true }) elemRef: ElementRef<HTMLDivElement>;

  _item: ILabelItem;
  _grid: number;
  _magnification: number;
  _maxWidth: number;
  _maxHeight: number;

  width: number;
  height: number;
  size: number;
  x: number;
  y: number;
  origElementDimensions: DOMRect;
  fieldType = FieldType;

  private maxWidthMm: number;
  private maxWidthPx: number;
  private maxHeightMm: number;
  private maxHeightPx: number;

  private elem: HTMLDivElement;

  constructor(
    private labelService: LabelService,
    private translateService: TranslateService
  ) {}

  @Input()
  set grid(grid: number) {
    this._grid = grid;
    this.recalculateMinMax();
  }

  @Input()
  set magnification(amount: number) {
    this._magnification = amount;
    this.recalculateMinMax();
    this.recalculate();
  }

  @Input()
  set maxHeight(height: number) {
    this._maxHeight = height;
    this.recalculateMinMax();
  }

  @Input()
  set maxWidth(width: number) {
    this._maxWidth = width;
    this.recalculateMinMax();
  }

  @Input()
  set item(item: ILabelItem) {
    this._item = item;
    this.recalculate();
  }

  ngAfterViewInit(): void {
    this.elem = this.elemRef.nativeElement;
  }

  private recalculateMinMax() {
    if (this._maxWidth) {
      this.maxWidthMm = this._maxWidth * this._magnification;
      this.maxWidthPx = this.labelService.mmToPixel(this.maxWidthMm);
    }
    if (this._maxHeight) {
      this.maxHeightMm = this._maxHeight * this._magnification;
      this.maxHeightPx = this.labelService.mmToPixel(this.maxHeightMm);
    }
  }

  private recalculate() {
    if (!this._item) {
      return;
    }
    this.width = this._item.style['width.mm'] * this._magnification;
    this.height = this._item.style['height.mm'] * this._magnification;
    this.size = this.labelService.mmToPixel(Math.min(this.width, this.height));
    this.x = this._item.x * this._magnification;
    this.y = this._item.y * this._magnification;

    // check that the item fits the label
    if (this.x + this.width > this.maxWidthMm) {
      this.x = Math.max(0, this.maxWidthMm - this.width);
    }
    if (this.y + this.height > this.maxHeightMm) {
      this.y = Math.max(0, this.maxHeightMm - this.height);
    }
  }

  recordElementDimensions() {
    this.origElementDimensions = this.elem.getBoundingClientRect() as DOMRect;
  }

  onMoveEnd() {
    const bounds = this.elem.getBoundingClientRect() as DOMRect;
    const deltaX = this.labelService.pixelToMm(bounds.x - this.origElementDimensions.x) / this._magnification;
    const deltaY = this.labelService.pixelToMm(bounds.y - this.origElementDimensions.y) / this._magnification;
    let x = this._item.x + deltaX;
    let y = this._item.y + deltaY;
    if (this._grid) {
      x = Math.round(x / this._grid) * this._grid;
      y = Math.round(y / this._grid) * this._grid;
    }
    this.itemChange.emit({
      ...this._item,
      x: Math.max(Math.min(x, this._maxWidth - this._item.style['width.mm']), 0),
      y: Math.max(Math.min(y, this._maxHeight - this._item.style['height.mm']), 0),
    });
  }

  onResize(event: CdkDragMove) {
    const width = event.pointerPosition.x - this.origElementDimensions.x - 7;
    const height = event.pointerPosition.y - this.origElementDimensions.y - 7;
    const widthMaxMm = this.labelService.pixelToMm(width) + this.x;
    const heightMaxMm = this.labelService.pixelToMm(height) + this.y;

    this.elem.style.width = (widthMaxMm <= this.maxWidthMm ? width : this.labelService.mmToPixel(this.maxWidthMm - this.x)) + 'px';
    this.elem.style.height = (heightMaxMm <= this.maxHeightMm ? height : this.labelService.mmToPixel(this.maxHeightMm - this.y)) + 'px';

    event.source.reset();
  }

  onResizeEnd(event: CdkDragEnd) {
    event.source.reset();
    let w = this.labelService.pixelToMm(this.elem.offsetWidth) / this._magnification;
    let h = this.labelService.pixelToMm(this.elem.offsetHeight) / this._magnification;
    if (this._grid) {
      const move = {
        x: this._item.x - (Math.round(this._item.x / this._grid) * this._grid),
        y: this._item.y - (Math.round(this._item.y / this._grid) * this._grid)
      };
      w = Math.round(w / this._grid) * this._grid + move.x;
      h = Math.round(h / this._grid) * this._grid + move.y;
    }
    w = Math.max(Math.min(w, this._maxWidth - this._item.x), 1);
    h = Math.max(Math.min(h, this._maxHeight - this._item.y), 1);

    if (this._item.fields[0] && this._item.fields[0].type === FieldType.qrCode && Math.min(w, h) < 10) {
      const msg = this.translateService.get('Making QR Code smaller than 10mm is possible but not recommended');
      if (msg) {
        alert(msg);
      }
    }
    this.itemChange.emit({
      ...this._item,
      style: {
        ...this._item.style,
        'width.mm': w,
        'height.mm': h
      }
    });
  }
}
