import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCategorieActeurComponent } from './form-categorie-acteur.component';

describe('FormCategorieActeurComponent', () => {
  let component: FormCategorieActeurComponent;
  let fixture: ComponentFixture<FormCategorieActeurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCategorieActeurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCategorieActeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
