import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStatusJuridiqueComponent } from './form-status-juridique.component';

describe('FormStatusJuridiqueComponent', () => {
  let component: FormStatusJuridiqueComponent;
  let fixture: ComponentFixture<FormStatusJuridiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormStatusJuridiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStatusJuridiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
