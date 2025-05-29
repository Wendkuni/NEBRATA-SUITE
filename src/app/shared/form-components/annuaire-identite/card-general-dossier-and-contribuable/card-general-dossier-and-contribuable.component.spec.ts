import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGeneralDossierAndContribuableComponent } from './card-general-dossier-and-contribuable.component';

describe('CardGeneralDossierAndContribuableComponent', () => {
  let component: CardGeneralDossierAndContribuableComponent;
  let fixture: ComponentFixture<CardGeneralDossierAndContribuableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGeneralDossierAndContribuableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardGeneralDossierAndContribuableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
