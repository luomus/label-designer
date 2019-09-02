import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelPreviewPagerComponent } from './label-preview-pager.component';

describe('LabelPreviewPagerComponent', () => {
  let component: LabelPreviewPagerComponent;
  let fixture: ComponentFixture<LabelPreviewPagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelPreviewPagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelPreviewPagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
