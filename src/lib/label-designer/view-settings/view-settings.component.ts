import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IViewSettings } from '../../label-designer.interface';

/**
 * @internal
 */
@Component({
  selector: 'll-view-settings',
  templateUrl: './view-settings.component.html',
  styleUrls: ['./view-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewSettingsComponent {

  @Input() viewSettings: IViewSettings = {magnification: 2};
  @Output() viewSettingsChange = new EventEmitter<IViewSettings>();

  magnifications: number[] = [
    1,
    2,
    3,
    4,
    5
  ];

  grid: number[] = [
    0.5,
    1,
    1.5,
    2
  ];

  change(field: string, value: any) {
    this.viewSettingsChange.emit({
      ...this.viewSettings,
      [field]: value
    });
  }
}
