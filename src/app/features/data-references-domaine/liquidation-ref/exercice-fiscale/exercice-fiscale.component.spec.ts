import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciceFiscaleComponent } from './exercice-fiscale.component';

describe('ExerciceFiscaleComponent', () => {
  let component: ExerciceFiscaleComponent;
  let fixture: ComponentFixture<ExerciceFiscaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciceFiscaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciceFiscaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
