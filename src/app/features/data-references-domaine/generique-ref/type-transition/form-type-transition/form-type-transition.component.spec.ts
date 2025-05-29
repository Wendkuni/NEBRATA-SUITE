import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTypeTransitionComponent } from './form-type-transition.component';

describe('FormCaregorieImmeubleComponent', () => {
  let component: FormTypeTransitionComponent;
  let fixture: ComponentFixture<FormTypeTransitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTypeTransitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTypeTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
