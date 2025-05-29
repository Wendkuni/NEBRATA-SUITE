import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoyerPourControleApresMocellementComponent } from './envoyer-pour-controle-apres-mocellement.component';

describe('EnvoyerPourControleApresMocellementComponent', () => {
  let component: EnvoyerPourControleApresMocellementComponent;
  let fixture: ComponentFixture<EnvoyerPourControleApresMocellementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvoyerPourControleApresMocellementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvoyerPourControleApresMocellementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
