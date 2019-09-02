import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelFieldsAvailableComponent } from './label-fields-available.component';

describe('LabelFieldsAvailableComponent', () => {
  let component: LabelFieldsAvailableComponent;
  let fixture: ComponentFixture<LabelFieldsAvailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelFieldsAvailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelFieldsAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
