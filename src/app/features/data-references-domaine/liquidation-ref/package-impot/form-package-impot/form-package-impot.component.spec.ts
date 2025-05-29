import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPackageImpotComponent } from './form-package-impot.component';

describe('FormPackageImpotComponent', () => {
  let component: FormPackageImpotComponent;
  let fixture: ComponentFixture<FormPackageImpotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPackageImpotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPackageImpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
