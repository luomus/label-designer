import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { ILabelField, ILabelPdf, ISetup, PresetSetup, QRCodeErrorCorrectionLevel } from '../../label-designer.interface';
import { LocalStorage } from 'ngx-webstorage';
import { LabelPrintComponent } from '../../label-print/label-print.component';
import { InfoWindowService } from '../../info-window/info-window.service';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { TranslateService } from '../../translate/translate.service';
import { LabelMakerFacade } from '../label-maker.facade';
import { take } from 'rxjs/operators';
import { LabelDesignerHelper } from '../../label-designer.helper';

export interface ILoadSetup {
  setup: ISetup;
  filename: string;
  availableFields?: ILabelField[];
}

/**
 * @internal
 */
@Component({
  selector: 'll-label-file',
  templateUrl: './label-file.component.html',
  styleUrls: ['./label-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelFileComponent {

  @Input() newSetup: ISetup;
  @Input() setup: ISetup;
  @Input() data: object[];
  @Input() defaultAvailableFields: ILabelField[];
  @Input() availableFields: ILabelField[];
  @Input() pdfLoading = false;
  @Input() qrCodeErrorCorrectionLevel: QRCodeErrorCorrectionLevel = QRCodeErrorCorrectionLevel.levelM;
  @Input() presets: PresetSetup[];

  @LocalStorage('recent-files', []) recentFiles: {setup: ISetup, filename: string, availableFields: ILabelField[]}[];

  @Output() html = new EventEmitter<ILabelPdf>();
  @Output() dataChange = new EventEmitter<object[]>();
  @Output() setupChange = new EventEmitter<ISetup>();
  @Output() availableFieldsChange = new EventEmitter<ILabelField[]>();
  @Output() pdfLoadingChange = new EventEmitter<boolean>();
  @ViewChild('printBtn', { static: true }) printBtn: LabelPrintComponent;
  @ViewChild('saveTpl', { static: true }) saveTpl: TemplateRef<any>;
  @ViewChild('saveActionsTpl', { static: true }) saveActionsTpl: TemplateRef<any>;
  @ViewChild('makePdfTpl', { static: true }) makePdfTpl: TemplateRef<any>;
  @ViewChild('makePdfActionsTpl', { static: true }) makePdfActionsTpl: TemplateRef<any>;

  filename = '';
  saveData = {
    file: '',
    includeData: false
  };
  pdfFile = '';

  constructor(
    private infoWindowService: InfoWindowService,
    private translateService: TranslateService,
    private labelMakerFacade: LabelMakerFacade
  ) { }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length < 1) {
      return;
    }
    this.filename = target.files[0].name;
    const error = () => {
      evt.target.value = '';
      this.labelMakerFacade.loadedFile('');
      alert(this.translateService.get('Could not find label information from the file!'));
    };

    if (this.filename.endsWith('.label')) {
      JSZip.loadAsync(target.files[0])
        .then(content => content.files['data.json'].async('text'))
        .then(jsonString => {
          evt.target.value = '';
          const data = JSON.parse(jsonString);
          if (data && data.setup) {
            LabelDesignerHelper.mergeFieldsToSetup(this.defaultAvailableFields, data.setup);
            this.setupChange.emit(data.setup);
            this.updateResentFiles({setup: data.setup, availableFields: data.fields}, this.filename);
            if (data.fields && Array.isArray(data.fields)) {
              this.availableFieldsChange.emit(data.fields);
              this.labelMakerFacade.loadedFile(this.filename);
            }
            if (data.data && Array.isArray(data.data)) {
              this.dataChange.emit(data.data);
            }
          } else {
            error();
          }
        })
        .catch(() => {
          error();
        });
    } else {
      error();
    }
  }

  save() {
    this.infoWindowService.open({
      title: this.translateService.get('Save to file'),
      content: this.saveTpl,
      actions: this.saveActionsTpl
    });
  }

  doSave() {
    this.infoWindowService.close();
    if (this.saveData.file) {
      const filename = this.saveData.file + (this.saveData.file.endsWith('.label') ? '' : '.label');
      const zip = new JSZip();
      const data = {
        version: 1,
        setup: this.setup,
        fields: this.availableFields,
        data: this.saveData.includeData && this.data ? this.data : undefined
      };
      zip.file('data.json', JSON.stringify(data));
      zip.generateAsync({type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 9 }})
        .then(function (blob) {
          saveAs(blob, filename);
        });
    }
    this.saveData = {
      file: '',
      includeData: false
    };
    this.labelMakerFacade.hasChanges(false);
  }

  print() {
    if (!this.data || this.data.length === 0) {
      return;
    }
    this.infoWindowService.open({
      title: this.translateService.get('Download labels (pdf)'),
      content: this.makePdfTpl,
      actions: this.makePdfActionsTpl
    });
  }

  doPrint() {
    this.infoWindowService.close();
    this.printBtn.renderPages();
  }

  private updateResentFiles(data: {setup: ISetup, availableFields: ILabelField[]}, filename: string) {
    const idx = this.recentFiles.findIndex(i => i.filename === filename);
    if (idx === -1) {
      this.recentFiles = [
        {...data, filename},
        ...this.recentFiles.slice(-2)
      ];
    } else {
      this.recentFiles = [
        {...data, filename},
        ...this.recentFiles.slice(0, idx),
        ...this.recentFiles.slice(idx + 1),
      ];
    }
  }

  removeRecent(idx: number) {
    this.recentFiles = [
      ...this.recentFiles.slice(0, idx),
      ...this.recentFiles.slice(idx + 1),
    ];
  }

  makeNew() {
    if (confirm(this.translateService.get('Are you sure that you want to start a new empty label?'))) {
      this.labelMakerFacade.loadedFile('');
      this.setupChange.emit(JSON.parse(JSON.stringify(this.newSetup)));
    }
  }

  updateSaveData(key: string, value: any) {
    this.saveData = {
      ...this.saveData,
      [key]: value
    };
  }

  loadSetup(recent: ILoadSetup | PresetSetup) {
    this.labelMakerFacade.hasChanges$.pipe(take(1)).subscribe(
      (hasChanges) => {
        if (hasChanges && !confirm(this.translateService.get('Do you want to discard the local changes?'))) {
          return;
        }
        LabelDesignerHelper.mergeFieldsToSetup(this.defaultAvailableFields, recent.setup);
        this.setupChange.emit(recent.setup);
        if (recent.availableFields) {
          this.availableFieldsChange.emit(recent.availableFields);
        }
        this.labelMakerFacade.loadedFile((recent as ILoadSetup).filename || (recent as PresetSetup).name);
      });
  }

  startPdfLoading() {
    if (this.pdfLoading) {
      return;
    }
    this.pdfLoadingChange.emit(true);
  }

  onHtml(html: string) {
    this.html.emit({
      filename: this.pdfFile.endsWith('.pdf') ? this.pdfFile : this.pdfFile + '.pdf',
      html
    });
  }
}
