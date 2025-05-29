import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPhysiqueValiderCompteComponent } from './form-physique-valider-compte.component';

describe('FormPhysiqueValiderCompteComponent', () => {
  let component: FormPhysiqueValiderCompteComponent;
  let fixture: ComponentFixture<FormPhysiqueValiderCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPhysiqueValiderCompteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPhysiqueValiderCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
