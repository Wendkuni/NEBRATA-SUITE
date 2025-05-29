import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDroitImmobilierComponent } from './form-droit-immobilier.component';

describe('FormCaregorieImmeubleComponent', () => {
  let component: FormDroitImmobilierComponent;
  let fixture: ComponentFixture<FormDroitImmobilierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDroitImmobilierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDroitImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
