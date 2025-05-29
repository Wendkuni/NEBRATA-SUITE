import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoyerPourControleApresMajComponent } from './envoyer-pour-controle-apres-maj.component';

describe('EnvoyerPourControleApresMajComponent', () => {
  let component: EnvoyerPourControleApresMajComponent;
  let fixture: ComponentFixture<EnvoyerPourControleApresMajComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvoyerPourControleApresMajComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvoyerPourControleApresMajComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
