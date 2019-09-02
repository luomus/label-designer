import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID
} from '@angular/core';
import { IAddLabelEvent, ILabelField, ISetup, FieldType } from '../../label-designer.interface';
import { CdkDragRelease } from '@angular/cdk/drag-drop';
import { LabelService } from '../../label.service';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * @internal
 */
@Component({
  selector: 'll-label-fields-available',
  templateUrl: './label-fields-available.component.html',
  styleUrls: ['./label-fields-available.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelFieldsAvailableComponent implements OnInit, OnDestroy {

  @Input() setup: ISetup;
  @Input() magnification = 2;

  @Output() availableFieldsChange = new EventEmitter<ILabelField[]>();
  @Output() addLabelItem = new EventEmitter<IAddLabelEvent>();
  @Output() dragging = new EventEmitter<boolean>();

  filterBy = '';
  filterSubject = new Subject<string>();
  filterSubscription: Subscription;
  addToBackside = false;
  isSame = true;

  private _availableFields: ILabelField[] = [];
  private _defaultAvailableFields: ILabelField[] = [];

  constructor(
    @Inject(PLATFORM_ID) protected platformId,
    private labelService: LabelService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.filterSubscription = this.filterSubject.asObservable().pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(value => {
      this.filterBy = value;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }

  @Input()
  set defaultAvailableFields(defaultAvailableFields: ILabelField[]) {
    this._defaultAvailableFields = defaultAvailableFields || [];
    this.checkIsSame();
  }

  get defaultAvailableFields() {
    return this._defaultAvailableFields;
  }

  @Input()
  set availableFields(availableFields: ILabelField[]) {
    this._availableFields = availableFields || [];
    this.checkIsSame();
  }

  get availableFields() {
    return this._availableFields;
  }

  filter(value) {
    this.filterSubject.next(value);
  }

  onNewFieldDragEnd(event: CdkDragRelease) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const targetElem = document.getElementById('label-editor');
    const targetBackElem = document.getElementById('back-side-label-editor');
    let targetBounds: any;
    const targetFrontBounds = targetElem.getBoundingClientRect();
    const targetBackBounds = targetBackElem ? targetBackElem.getBoundingClientRect() : false;
    const elemBounds = event.source.element.nativeElement.getBoundingClientRect();
    if (
      targetFrontBounds.left <= elemBounds.left && (targetFrontBounds.left + targetFrontBounds.width) > elemBounds.left &&
      targetFrontBounds.top <= elemBounds.top && (targetFrontBounds.top + targetFrontBounds.height) > elemBounds.top
    ) {
      targetBounds = targetFrontBounds;
    } else if (
      targetBackBounds &&
      targetBackBounds.left <= elemBounds.left && (targetBackBounds.left + targetBackBounds.width) > elemBounds.left &&
      targetBackBounds.top <= elemBounds.top && (targetBackBounds.top + targetBackBounds.height) > elemBounds.top
    ) {
      targetBounds = targetBackBounds;
    }

    if (targetBounds) {
      const field: ILabelField = JSON.parse(JSON.stringify(event.source.data));
      const width = field.type === FieldType.qrCode ? 10 : 25;
      const height = field.type === FieldType.qrCode ? 10 : 5;
      const xPos = this.labelService.pixelToMm((elemBounds.left - targetBounds.left) / this.magnification);
      const yPos = this.labelService.pixelToMm((elemBounds.top - targetBounds.top) / this.magnification);
      this.addLabelItem.emit({location: targetBounds === targetFrontBounds ? 'labelItems' : 'backSideLabelItems', item: {
          type: 'field',
          y: yPos,
          x: xPos,
          fields: [field],
          style: {
            'height.mm': Math.min(height, this.labelService.pixelToMm(targetBounds.height / this.magnification) - yPos),
            'width.mm': Math.min(width, this.labelService.pixelToMm(targetBounds.width / this.magnification) - xPos)
          }
        }});
    }
    event.source.reset();
  }

  addField(field: ILabelField) {
    const width = field.type === FieldType.qrCode ? 10 : 25;
    const height = field.type === FieldType.qrCode ? 10 : 5;
    this.addLabelItem.emit({
      location: this.setup.twoSided && this.addToBackside ? 'backSideLabelItems' : 'labelItems',
      item: {
        type: 'field',
        y: 0,
        x: 0,
        fields: [field],
        style: {
          'height.mm': Math.min(height, this.setup.label['height.mm']),
          'width.mm': Math.min(width, this.setup.label['width.mm'])
        }
      }});
  }

  toggleBackside() {
    this.addToBackside = !this.addToBackside;
  }

  checkIsSame(): boolean {
    if (this.availableFields.length !== this.defaultAvailableFields.length) {
      this.isSame = false;
      return;
    }
    const keys = new Set<string>();
    this.defaultAvailableFields.forEach(field => keys.add(field.field));
    let result = true;
    this.availableFields.forEach(field => {
      if (result && !keys.has(field.field)) {
        result = false;
      }
    });
    this.isSame = result;
  }
}
