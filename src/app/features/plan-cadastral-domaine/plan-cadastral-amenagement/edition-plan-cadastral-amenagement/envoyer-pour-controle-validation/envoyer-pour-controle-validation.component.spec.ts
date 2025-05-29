import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoyerPourControleValidationComponent } from './envoyer-pour-controle-validation.component';

describe('EnvoyerPourControleValidationComponent', () => {
  let component: EnvoyerPourControleValidationComponent;
  let fixture: ComponentFixture<EnvoyerPourControleValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvoyerPourControleValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvoyerPourControleValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
