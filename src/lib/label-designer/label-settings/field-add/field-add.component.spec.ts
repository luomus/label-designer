import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldAddComponent } from './field-add.component';

describe('FieldAddComponent', () => {
  let component: FieldAddComponent;
  let fixture: ComponentFixture<FieldAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
