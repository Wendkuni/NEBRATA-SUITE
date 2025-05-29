import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnulationDossierTransitionComponent } from './annulation-dossier-transition.component';

describe('AnnulationDossierTransitionComponent', () => {
  let component: AnnulationDossierTransitionComponent;
  let fixture: ComponentFixture<AnnulationDossierTransitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnulationDossierTransitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnulationDossierTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
