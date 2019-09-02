import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelValueMapComponent } from './label-value-map.component';

describe('LabelValueMapComponent', () => {
  let component: LabelValueMapComponent;
  let fixture: ComponentFixture<LabelValueMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelValueMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelValueMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
