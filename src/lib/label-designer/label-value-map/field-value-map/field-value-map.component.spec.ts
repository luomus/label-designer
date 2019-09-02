import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldValueMapComponent } from './field-value-map.component';

describe('FieldValueMapComponent', () => {
  let component: FieldValueMapComponent;
  let fixture: ComponentFixture<FieldValueMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldValueMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldValueMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
