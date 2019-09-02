import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FontSettingsComponent } from './font-settings.component';

describe('FontSettingsComponent', () => {
  let component: FontSettingsComponent;
  let fixture: ComponentFixture<FontSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FontSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FontSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
