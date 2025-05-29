import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoyerPourControleApresFusionComponent } from './envoyer-pour-controle-apres-fusion.component';

describe('EnvoyerPourControleApresFusionnementComponent', () => {
  let component: EnvoyerPourControleApresFusionComponent;
  let fixture: ComponentFixture<EnvoyerPourControleApresFusionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvoyerPourControleApresFusionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvoyerPourControleApresFusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
