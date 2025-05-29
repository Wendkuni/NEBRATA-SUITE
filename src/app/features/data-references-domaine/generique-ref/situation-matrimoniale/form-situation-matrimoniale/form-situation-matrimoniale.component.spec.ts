import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSituationMatrimonialeComponent } from './form-situation-matrimoniale.component';

describe('FormSituationMatrimonialeComponent', () => {
  let component: FormSituationMatrimonialeComponent;
  let fixture: ComponentFixture<FormSituationMatrimonialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSituationMatrimonialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSituationMatrimonialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
