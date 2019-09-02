import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelDesignerComponent } from './label-designer.component';

describe('LabelDesignerComponent', () => {
  let component: LabelDesignerComponent;
  let fixture: ComponentFixture<LabelDesignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelDesignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
