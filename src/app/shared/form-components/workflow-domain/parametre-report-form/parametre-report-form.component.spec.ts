import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametreReportFormComponent } from './parametre-report-form.component';

describe('ParametreReportFormComponent', () => {
  let component: ParametreReportFormComponent;
  let fixture: ComponentFixture<ParametreReportFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametreReportFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametreReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
