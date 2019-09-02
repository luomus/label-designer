import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelPageComponent } from './label-page.component';

describe('LabelPageComponent', () => {
  let component: LabelPageComponent;
  let fixture: ComponentFixture<LabelPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
