import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPageIndivisionComponent } from './form-page-indivision.component';

describe('FormPageIndivisionComponent', () => {
  let component: FormPageIndivisionComponent;
  let fixture: ComponentFixture<FormPageIndivisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPageIndivisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPageIndivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
