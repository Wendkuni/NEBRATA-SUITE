import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPageArrondissementComponent } from './form-page-arrondissement.component';

describe('FormPageArrondissementComponent', () => {
  let component: FormPageArrondissementComponent;
  let fixture: ComponentFixture<FormPageArrondissementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPageArrondissementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPageArrondissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
