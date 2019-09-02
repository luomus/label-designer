import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { LabelService } from '../../../label.service';

/**
 * @internal
 */
@Component({
  selector: 'll-editor-grid',
  templateUrl: './editor-grid.component.html',
  styleUrls: ['./editor-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorGridComponent implements OnChanges {

  @Input() grid: number;
  @Input() magnification: number;

  size;

  constructor(
    private labelService: LabelService
  ) { }

  ngOnChanges() {
    if (!this.grid || !this.magnification) {
      return;
    }
    this.size = this.labelService.mmToPixel(this.grid * this.magnification);
  }

}
