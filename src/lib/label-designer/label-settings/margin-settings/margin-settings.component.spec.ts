import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginSettingsComponent } from './margin-settings.component';

describe('MarginSettingsComponent', () => {
  let component: MarginSettingsComponent;
  let fixture: ComponentFixture<MarginSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarginSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
