import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  FieldType,
  IAddLabelEvent,
  IColumnMap,
  ILabelField,
  ILabelItem,
  ILabelPdf,
  ILabelValueMap,
  ISetup,
  IViewSettings,
  PresetSetup,
  QRCodeErrorCorrectionLevel
} from '../label-designer.interface';
import { IPageLayout, LabelService } from '../label.service';
import { InfoWindowService } from '../info-window/info-window.service';
import { Observable, Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LabelExcelFileComponent } from './label-excel-file/label-excel-file.component';
import { LabelDesignerTranslationsInterface } from '../translate/label-designer-translations.interface';
import { TranslateService } from '../translate/translate.service';
import { LabelMakerFacade } from './label-maker.facade';
import { FieldKeyPipe } from '../pipe/field-key.pipe';

/**
 * Label designer window that can be used to load, edit, show preview and send the html from the labels to the host component.
 */
@Component({
  selector: 'll-label-designer',
  templateUrl: './label-designer.component.html',
  styleUrls: ['./label-designer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelDesignerComponent implements OnInit, OnDestroy {

  /**
   * @internal
   */
  static id = 0;

  /**
   * @internal
   */
  @ViewChild('intro', { static: true }) intro;

  /**
   * @internal
   */
  @ViewChild('gettingStarted', { static: true }) gettingStarted;

  /**
   * @internal
   */
  _active: 'file'|'edit'|'view'|'settings'|'fields'|'help'|'close'|'map' = 'file';
  /**
   * @internal
   */
  _setup: ISetup;
  /**
   * @internal
   */
  _data: object[] = [];
  /**
   * @internal
   */
  _selectedLabelItem: ILabelItem | undefined;
  /**
   * @internal
   */
  _viewSettings: IViewSettings = {magnification: 2};
  /**
   * @internal
   */
  generateFields: ILabelField[];
  /**
   * @internal
   */
  dragging = false;
  /**
   * @internal
   */
  filename$: Observable<string>;
  /**
   * @internal
   */
  version = '3.2.0';
  /**
   * @internal
   */
  previewActive = 0;
  /**
   * Default domain that is used on generate data dialog.
   */
  @Input() defaultDomain = '';
  /**
   * Setup that is used when the user clicks new from the file menu.
   * This is optional input and if this is missing there will not be new button visible.
   */
  @Input() defaultSetup: ISetup;
  /**
   * These are the default label fields. If the user import an excel file available fields changes and if that list is different from this
   * there will be a reset button visible on label fields tab.
   */
  @Input() defaultAvailableFields: ILabelField[];
  /**
   * These are all the available fields that the user can add the label.
   */
  @Input() availableFields: ILabelField[];
  /**
   * Whether or not show the intro on startup.
   */
  @Input() showIntro = true;
  /**
   * Since the loading of the pdf is done externally this will tell the editor to display loading indicator on the download the pdf link.
   */
  @Input() pdfLoading = false;
  /**
   * Error correction level used on the QR Code.
   */
  @Input() qrCodeErrorCorrectionLevel: QRCodeErrorCorrectionLevel = QRCodeErrorCorrectionLevel.levelM;
  /**
   * Preset setups that the user can pick from the file menu.
   */
  @Input() presets: PresetSetup[];
  /**
   * Map spreadsheet columns to where fields
   */
  @Input() fileColumnMap: IColumnMap;

  /**
   * Event that triggers when the html for the label is generated. Event holds the desired filename and the html string
   * (See {@link ILabelPdf}).
   */
  @Output() html: EventEmitter<ILabelPdf> = new EventEmitter<ILabelPdf>();

  /**
   * Triggered when view settings change.
   */
  @Output() viewSettingsChange: EventEmitter<IViewSettings> = new EventEmitter<IViewSettings>();

  /**
   * Triggered when the data is changed. This can occurs when the excel is imported or when the data is generated using the generate dialog.
   */
  @Output() dataChange: EventEmitter<object[]> = new EventEmitter<object[]>();

  /**
   * Triggered when setup changes. This happens on every change on the label, so make sure that performance of the chain of the event's
   * that this triggers is good and that it doesn't block the ui thread.
   */
  @Output() setupChange: EventEmitter<ISetup> = new EventEmitter<ISetup>();

  /**
   * Triggered when the intro dialog is closed.
   */
  @Output() introClosed: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Triggered when available fields are changed.
   */
  @Output() availableFieldsChange: EventEmitter<ILabelField[]> = new EventEmitter<ILabelField[]>();

  /**
   * Triggered when pdf loading is changed
   */
  @Output() pdfLoadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Triggered when spreadsheet columns mapping changes
   */
  @Output() fileColumnMapChange: EventEmitter<IColumnMap> = new EventEmitter<IColumnMap>();

  /**
   * @internal
   */
  @ViewChild('editor', { static: false }) editor: ElementRef<HTMLDivElement>;
  /**
   * @internal
   */
  @ViewChild('generateTpl', { static: true }) generateTpl: TemplateRef<any>;
  /**
   * @internal
   */
  @ViewChild('generateActionsTpl', { static: true }) generateActionsTpl: TemplateRef<any>;
  /**
   * @internal
   */
  @ViewChild('excelFile', { static: false }) excelCmp: LabelExcelFileComponent;
  /**
   * @internal
   */
  @ViewChild('excelTpl', { static: true }) excelTpl: TemplateRef<any>;
  /**
   * @internal
   */
  @ViewChild('excelActionsTpl', { static: true }) excelActionsTpl: TemplateRef<any>;

  /**
   * @internal
   */
  subIntro: Subscription;

  /**
   * @internal
   */
  generate: {
    uri: string;
    rangeStart: number;
    rangeEnd: number;
    data: {[key: string]: string}
  } = {
    uri: '',
    rangeStart: undefined,
    rangeEnd: undefined,
    data: {}
  };

  /**
   * @internal
   */
  dimensions: IPageLayout;

  private _undo: ISetup[] = [];
  private _redo: ISetup[] = [];

  /**
   * @internal
   */
  constructor(
    private labelService: LabelService,
    private renderer2: Renderer2,
    private infoWindowService: InfoWindowService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private labelMakerFacade: LabelMakerFacade
  ) { }

  ngOnInit(): void {
    if (this.showIntro) {
      this.openIntro();
    }
    this.filename$ = this.labelMakerFacade.currentFile$;
  }

  ngOnDestroy(): void {
    if (this.subIntro) {
      this.subIntro.unsubscribe();
    }
  }

  /**
   * Translations for the component. See {@link LabelDesignerTranslationsInterface} to see what values can be translated.
   */
  @Input()
  set translations(translations: LabelDesignerTranslationsInterface) {
    this.translateService.setTranslations(translations);
  }

  /**
   * Array of data objects. Each object in the array will generate one label.
   */
  @Input()
  set data(data: object[]) {
    if (!Array.isArray(data)) {
      data = [];
    }
    this._data = data;
    this.setPreviewActive(0);
  }

  get data() {
    return this._data;
  }

  /**
   * View settings to use. See {@link IViewSettings} for details on what can be set.
   */
  @Input()
  set viewSettings(settings: IViewSettings) {
    if (!settings) {
      return;
    }
    if (isPlatformBrowser(this.platformId) && settings.fullscreen !== this._viewSettings.fullscreen) {
      try {
        if (settings.fullscreen) {
          const elem: any = this.editor.nativeElement;
          const enterMethod = elem.requestFullScreen || elem.webkitRequestFullScreen ||
            elem.mozRequestFullScreen || elem.msRequestFullScreen;
          if (enterMethod) {
            enterMethod.call(elem);
          }
        } else if (this._viewSettings.fullscreen) {
          const doc: any = document;
          const exitMethod = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;
          if (exitMethod) {
            exitMethod.call(doc);
          }
        }
      } catch (e) {}
    }
    this._viewSettings = settings;
  }

  get viewSettings() {
    return this._viewSettings;
  }

  /**
   * Setup for the whole page see {@link ISetup}
   */
  @Input()
  set setup(setup: ISetup) {
    if (!setup) {
      return;
    }
    const hasField = {};
    const allFields = [];
    LabelDesignerComponent.id = this.findTheHighestId(setup) + 1;

    const checkItem = (item) => {
      item.fields.forEach(field => {
        const isText = field.type === 'text';
        const fieldId = FieldKeyPipe.getKey(field);
        if (!hasField[fieldId] && (!field.type || isText)) {
          hasField[fieldId] = true;
          allFields.push(field);
        }
      });
      return {...item, _id: item._id || LabelDesignerComponent.id++};
    };

    this._setup = {
      ...setup,
      labelItems: setup.labelItems.map(checkItem),
      backSideLabelItems: (setup.backSideLabelItems || []).map(checkItem)
    };
    this.dimensions = this.labelService.countLabelsPerPage(this._setup);
    this.generateFields = allFields;
    if (this._selectedLabelItem) {
      let idx = this._setup.labelItems.findIndex(i => i._id === this._selectedLabelItem._id);
      if (idx !== -1) {
        this._selectedLabelItem = this._setup.labelItems[idx];
      } else {
        idx = this._setup.backSideLabelItems.findIndex(i => i._id === this._selectedLabelItem._id);
        this._selectedLabelItem = this._setup.backSideLabelItems[idx];
      }
    }
    this.setPreviewActive(this.previewActive);
  }

  get setup(): ISetup {
    return this._setup;
  }

  /**
   * @internal
   */
  showSettings(item: ILabelItem) {
    this.setActiveLabelItem(item);
    this._active = 'settings';
    this.cdr.detectChanges();
  }

  /**
   * @internal
   */
  setActiveLabelItem(item: ILabelItem) {
    this._selectedLabelItem = item;
    this.cdr.detectChanges();
  }

  /**
   * @internal
   */
  setupChanged(setup: ISetup, addToUndo = true) {
    if (addToUndo) {
      this._redo = [];
      this._undo.push(this._setup);
    }
    this._setup = setup;
    this.setupChange.emit(this._setup);
    if (this._undo.length > 20) {
      this._undo.shift();
    }
  }

  /**
   * @internal
   */
  addLabelItem(event: IAddLabelEvent) {
    const item = event.item;
    if (!item._id) {
      item._id = LabelDesignerComponent.id++;
    }
    this._undo.push(this._setup);
    this._setup = {...this._setup, [event.location]: [...this._setup[event.location], item]};
    this.setupChange.emit(this._setup);
  }

  /**
   * @internal
   */
  done() {
    this._selectedLabelItem = undefined;
  }

  /**
   * Undo the changes if there are anything to undo
   */
  undo() {
    if (this.hasUndo()) {
      this._redo.push(this._setup);
      this.setupChanged(this._undo.pop(), false);
    }
  }

  /**
   * Redo the changes if there are anything to redo
   */
  redo() {
    if (this.hasRedo()) {
      this._undo.push(this._setup);
      this.setupChanged(this._redo.pop(), false);
    }
  }

  /**
   * @internal
   */
  hasUndo() {
    return this._undo.length > 0;
  }

  /**
   * @internal
   */
  hasRedo() {
    return this._redo.length > 0;
  }

  /**
   * @internal
   */
  updateGenerate(field: ILabelField | string, value: string, inData = false) {
    const key = typeof field === 'string' ? field : FieldKeyPipe.getKey(field);
    if (inData) {
      this.generate = {
        ...this.generate,
        data: {
          ...this.generate.data,
          [key]: value
        }
      };
    } else {
      this.generate = {
        ...this.generate,
        [key]: value
      };
    }
  }

  /**
   * @internal
   */
  generateData() {
    this.infoWindowService.close();
    this.generate.rangeStart = Number(this.generate.rangeStart);
    this.generate.rangeEnd = Number(this.generate.rangeEnd);
    const MAX = 10000;
    const data = [];
    const uri = this.generate.uri + (this.generate.uri.indexOf('%id%') > -1 ? '' : '%id%');
    const hasUri = uri.startsWith('http');
    const start = this.generate.rangeStart < this.generate.rangeEnd ? this.generate.rangeStart : this.generate.rangeEnd;
    const end = this.generate.rangeStart > this.generate.rangeEnd ? this.generate.rangeStart : this.generate.rangeEnd;
    const uriFieldsIdx = this.availableFields.findIndex(item => item.type === FieldType.qrCode);
    const uriField = uriFieldsIdx !== -1 ? this.availableFields[uriFieldsIdx].field : 'id';
    const domainFieldsIdx = this.availableFields.findIndex(item => item.type === FieldType.domain);
    const idFieldsIdx = this.availableFields.findIndex(item => item.type === FieldType.id);

    const addTextField = (field) => {
      if (field.type === FieldType.text) {
        const key = FieldKeyPipe.getKey(field);
        if (typeof this.generate.data[key] === 'undefined') {
          this.generate.data[key] = '';
        }
      }
    };

    this._setup.labelItems.forEach(item => {
      item.fields.forEach(addTextField);
    });
    (this._setup.backSideLabelItems || []).forEach(item => {
      item.fields.forEach(addTextField);
    });

    let current = 0;
    for (let i = start; i <= end; i++) {
      current++;
      if (current > MAX) {
        break;
      }
      const rowUri = uri.replace('%id%', '' + i);
      const rowData = {
        ...this.generate.data,
        [uriField]: rowUri
      };
      if (hasUri) {
        const parsedUri = LabelService.parseUri(rowUri);
        if (domainFieldsIdx > -1) {
          rowData[this.availableFields[domainFieldsIdx].field] = parsedUri.domain;
        }
        if (idFieldsIdx > -1) {
          rowData[this.availableFields[idFieldsIdx].field] = parsedUri.id;
        }
      }
      data.push(rowData);
    }
    this.data = data;
    this.setPreviewActive(0);
    this.dataChange.emit(this.data);
  }

  /**
   * Open getting started dialog
   */
  openGettingStarted() {
    this.subIntro = this.infoWindowService.open({
      title: this.translateService.get('Getting started'),
      actionTypes: 'ok',
      content: this.gettingStarted
    }).subscribe(() => this.introClosed.emit());
  }

  /**
   * Open intro dialog
   */
  openIntro() {
    this.subIntro = this.infoWindowService.open({
      title: this.translateService.get('Label Designer'),
      actionTypes: 'ok',
      content: this.intro
    }).subscribe(() => this.introClosed.emit());
  }

  /**
   * Open generate dialog
   */
  openGenerate() {
    if (!this.generate.uri) {
      this.generate.uri = this.defaultDomain;
    }
    LabelService.forEachField(this.setup, (field) => {
      if (field.type === FieldType.text) {
        const key = FieldKeyPipe.getKey(field);
        if (typeof this.generate.data[key] === 'undefined') {
          this.generate.data[key] = field.label;
        }
      }
    });
    this.infoWindowService.open({
      title: this.translateService.get('Generate label data'),
      content: this.generateTpl,
      actions: this.generateActionsTpl
    });
  }

  /**
   * Open excel import dialog
   */
  openImportExcel() {
    this.infoWindowService.open({
      title: this.translateService.get('Import from file'),
      content: this.excelTpl,
      actions: this.excelActionsTpl
    });
  }

  /**
   * Preview the specific item on the data array.
   */
  setPreviewActive(idx: number) {
    if (this.data && this.data[idx]) {
      this.previewActive = idx;
      this.cdr.detectChanges();
    }
  }

  /**
   * @internal
   */
  newFieldDragging(event: boolean, settings: HTMLDivElement) {
    if (event) {
      this.renderer2.setStyle(settings, 'margin-top', '-' + settings.scrollTop + 'px');
      this.renderer2.setStyle(settings, 'padding-bottom', settings.scrollTop + 'px');
      this.renderer2.setStyle(settings, 'height', 'calc(100% + ' + settings.scrollTop + 'px)');
      this.renderer2.setStyle(settings, 'z-index', '-1');
    } else {
      this.renderer2.setStyle(settings, 'margin-top', '0px');
      this.renderer2.removeStyle(settings, 'z-index');
      this.renderer2.removeStyle(settings, 'padding-bottom');
      this.renderer2.setStyle(settings, 'height', '100%');
    }
    this.dragging = event;
  }

  /**
   * @internal
   */
  onViewSettingsChange(event: IViewSettings) {
    this.viewSettings = event;
    this.viewSettingsChange.emit(event);
  }

  /**
   * @internal
   */
  loadExcelData() {
    const result = this.excelCmp.loadData();
    if (result.availableFields) {
      this.availableFieldsChange.emit(result.availableFields);
    }
    this.data = result.data;
    this.infoWindowService.close();
    this.dataChange.emit(this.data);
  }

  clearData() {
    if (!this.data || this.data.length === 0) {
      return;
    }
    if (confirm(this.translateService.get('Are you sure that you want to clear the data form the label?'))) {
      this.data = [];
      this.resetContent();
      this.dataChange.emit(this.data);
    }
  }

  /**
   * @internal
   */
  onValueMapChange(map: ILabelValueMap) {
    this.setupChanged({ ...this._setup, valueMap: map }, false);
  }

  private findTheHighestId(setup: ISetup) {
    let id = 0;
    LabelService.forEachLabelItem(setup, (item) => {
      if (item._id > id) {
        id = item._id;
      }
    });
    return id;
  }

  private resetContent() {
    const setup = this._setup;
    LabelService.forEachField(setup, (field) => {
      if (field.type === FieldType.text) {
        field.content = field.label;
      }
    });
    this.setupChanged(setup, false);
  }

  /**
   * @internal
   */
  onPdfLoading(loading: boolean) {
    this.pdfLoading = true;
    this.pdfLoadingChange.emit(loading);
  }
}
