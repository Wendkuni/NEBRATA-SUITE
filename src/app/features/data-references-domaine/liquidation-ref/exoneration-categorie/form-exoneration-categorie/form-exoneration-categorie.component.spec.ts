import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExonerationCategorieComponent } from './form-exoneration-categorie.component';

describe('FormExonerationCategorieComponent', () => {
  let component: FormExonerationCategorieComponent;
  let fixture: ComponentFixture<FormExonerationCategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormExonerationCategorieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormExonerationCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
