import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExerciceFiscaleComponent } from './form-exercice-fiscale.component';

describe('FormExerciceFiscaleComponent', () => {
  let component: FormExerciceFiscaleComponent;
  let fixture: ComponentFixture<FormExerciceFiscaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormExerciceFiscaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormExerciceFiscaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
