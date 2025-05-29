import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDegreSuccessoralComponent } from './form-degre-successoral.component';

describe('FormDegreSuccessoralComponent', () => {
  let component: FormDegreSuccessoralComponent;
  let fixture: ComponentFixture<FormDegreSuccessoralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDegreSuccessoralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDegreSuccessoralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
