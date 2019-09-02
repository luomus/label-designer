import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelFileComponent } from './label-file.component';

describe('LabelFileComponent', () => {
  let component: LabelFileComponent;
  let fixture: ComponentFixture<LabelFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
