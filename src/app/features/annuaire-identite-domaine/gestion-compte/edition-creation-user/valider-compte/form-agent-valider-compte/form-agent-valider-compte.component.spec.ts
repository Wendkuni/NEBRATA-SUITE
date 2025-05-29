import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAgentValiderCompteComponent } from './form-agent-valider-compte.component';

describe('FormAgentValiderCompteComponent', () => {
  let component: FormAgentValiderCompteComponent;
  let fixture: ComponentFixture<FormAgentValiderCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAgentValiderCompteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAgentValiderCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
