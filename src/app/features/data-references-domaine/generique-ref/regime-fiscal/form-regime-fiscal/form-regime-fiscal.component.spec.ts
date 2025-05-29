import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRegimeFiscalComponent } from './form-regime-fiscal.component';

describe('FormRegimeFiscalComponent', () => {
  let component: FormRegimeFiscalComponent;
  let fixture: ComponentFixture<FormRegimeFiscalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRegimeFiscalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRegimeFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
