import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * @internal
 */
@Component({
  selector: 'll-label-preview-pager',
  templateUrl: './label-preview-pager.component.html',
  styleUrls: ['./label-preview-pager.component.scss']
})
export class LabelPreviewPagerComponent {

  total = 0;

  @Input() active = 0;
  @Output() activeChange = new EventEmitter<number>();

  @Input()
  set data(obj: object[]) {
    this.total = obj && obj.length || 0;
  }

  move(number: number) {
    let target = this.active + number;
    if (target >= this.total) {
      target = 0;
    } else if (target < 0) {
      target = this.total - 1;
    }
    this.activeChange.emit(target);
  }
}
