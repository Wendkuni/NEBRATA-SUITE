import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExonerationComponent } from './form-exoneration.component';

describe('FormExonerationComponent', () => {
  let component: FormExonerationComponent;
  let fixture: ComponentFixture<FormExonerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormExonerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormExonerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
