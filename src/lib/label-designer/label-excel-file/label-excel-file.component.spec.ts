import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelExcelFileComponent } from './label-excel-file.component';

describe('LabelExcelFileComponent', () => {
  let component: LabelExcelFileComponent;
  let fixture: ComponentFixture<LabelExcelFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelExcelFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelExcelFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
