import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormActeurValiderCompteComponent } from './form-acteur-valider-compte.component';

describe('FormActeurValiderCompteComponent', () => {
  let component: FormActeurValiderCompteComponent;
  let fixture: ComponentFixture<FormActeurValiderCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormActeurValiderCompteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormActeurValiderCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
