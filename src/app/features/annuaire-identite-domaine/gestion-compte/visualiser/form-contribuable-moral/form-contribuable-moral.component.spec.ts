import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormContribuableMoralComponent } from './form-contribuable-moral.component';

describe('FormContribuableMoralComponent', () => {
  let component: FormContribuableMoralComponent;
  let fixture: ComponentFixture<FormContribuableMoralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormContribuableMoralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormContribuableMoralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
