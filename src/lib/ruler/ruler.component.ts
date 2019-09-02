import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild } from '@angular/core';
import { LabelService } from '../label.service';

/**
 * @internal
 */
@Component({
  selector: 'll-ruler',
  templateUrl: './ruler.component.html',
  styleUrls: ['./ruler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RulerComponent implements AfterViewInit {

  @ViewChild('ruler', { static: true }) rulerElemRef: ElementRef<HTMLDivElement>;
  @Output() measured = new EventEmitter<void>();

  constructor(private renderer: Renderer2, private labelService: LabelService) { }

  ngAfterViewInit() {
    this.labelService.initPixelMMRatio(this.rulerElemRef.nativeElement);
    this.renderer.setStyle(this.rulerElemRef.nativeElement, 'display', 'none');
    setTimeout(() => this.measured.emit());
  }

}
