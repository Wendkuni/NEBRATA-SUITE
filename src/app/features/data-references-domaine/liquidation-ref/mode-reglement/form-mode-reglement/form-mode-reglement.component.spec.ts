import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormModeReglementComponent } from './form-mode-reglement.component';

describe('FormModeReglementComponent', () => {
  let component: FormModeReglementComponent;
  let fixture: ComponentFixture<FormModeReglementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormModeReglementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormModeReglementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
