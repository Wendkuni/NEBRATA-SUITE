import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationSaisieLotissementComponent } from './validation-saisie-lotissement.component';

describe('ValidationSaisieLotissementComponent', () => {
  let component: ValidationSaisieLotissementComponent;
  let fixture: ComponentFixture<ValidationSaisieLotissementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationSaisieLotissementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationSaisieLotissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
