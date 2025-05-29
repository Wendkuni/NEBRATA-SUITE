import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTypeTitreRecetteComponent } from './form-type-titre-recette.component';

describe('FormTypeTitreRecetteComponent', () => {
  let component: FormTypeTitreRecetteComponent;
  let fixture: ComponentFixture<FormTypeTitreRecetteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTypeTitreRecetteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTypeTitreRecetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
