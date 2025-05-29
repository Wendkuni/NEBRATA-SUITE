import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenvoyerDossierTransitionComponent } from './renvoyer-dossier-transition.component';

describe('RenvoyerDossierTransitionComponent', () => {
  let component: RenvoyerDossierTransitionComponent;
  let fixture: ComponentFixture<RenvoyerDossierTransitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenvoyerDossierTransitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenvoyerDossierTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
