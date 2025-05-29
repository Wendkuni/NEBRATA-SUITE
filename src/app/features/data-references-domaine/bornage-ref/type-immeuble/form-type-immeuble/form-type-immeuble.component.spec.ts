import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTypeImmeubleComponent } from './form-type-immeuble.component';

describe('FormTypeImmeubleComponent', () => {
  let component: FormTypeImmeubleComponent;
  let fixture: ComponentFixture<FormTypeImmeubleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTypeImmeubleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTypeImmeubleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
