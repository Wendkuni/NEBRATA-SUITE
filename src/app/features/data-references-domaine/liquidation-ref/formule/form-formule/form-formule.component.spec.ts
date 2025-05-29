import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFormuleComponent } from './form-formule.component';

describe('FormFormuleComponent', () => {
  let component: FormFormuleComponent;
  let fixture: ComponentFixture<FormFormuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFormuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFormuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
