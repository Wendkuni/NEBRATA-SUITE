import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCategorieImmeubleComponent } from './form-categorie-immeuble.component';

describe('FormCaregorieImmeubleComponent', () => {
  let component: FormCategorieImmeubleComponent;
  let fixture: ComponentFixture<FormCategorieImmeubleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCategorieImmeubleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCategorieImmeubleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
