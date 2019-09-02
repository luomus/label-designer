import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelPreviewComponent } from './label-preview.component';

describe('LabelPreviewComponent', () => {
  let component: LabelPreviewComponent;
  let fixture: ComponentFixture<LabelPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
