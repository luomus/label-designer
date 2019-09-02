import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelEditorComponent } from './label-editor.component';

describe('LabelEditorComponent', () => {
  let component: LabelEditorComponent;
  let fixture: ComponentFixture<LabelEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
