import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelPrintComponent } from './label-print.component';

describe('LabelPrintComponent', () => {
  let component: LabelPrintComponent;
  let fixture: ComponentFixture<LabelPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
