import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationSaisieAmenagementComponent } from './validation-saisie-amenagement.component';

describe('ValidationSaisieLotissementComponent', () => {
  let component: ValidationSaisieAmenagementComponent;
  let fixture: ComponentFixture<ValidationSaisieAmenagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationSaisieAmenagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationSaisieAmenagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
