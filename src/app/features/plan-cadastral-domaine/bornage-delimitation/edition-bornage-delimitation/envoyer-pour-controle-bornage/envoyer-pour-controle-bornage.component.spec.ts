import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoyerPourControleBornageComponent } from './envoyer-pour-controle-bornage.component';

describe('EnvoyerPourControleBornageComponent', () => {
  let component: EnvoyerPourControleBornageComponent;
  let fixture: ComponentFixture<EnvoyerPourControleBornageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvoyerPourControleBornageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvoyerPourControleBornageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
