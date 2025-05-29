import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMoralValiderCompteComponent } from './form-moral-valider-compte.component';

describe('FormMoralValiderCompteComponent', () => {
  let component: FormMoralValiderCompteComponent;
  let fixture: ComponentFixture<FormMoralValiderCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMoralValiderCompteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMoralValiderCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
