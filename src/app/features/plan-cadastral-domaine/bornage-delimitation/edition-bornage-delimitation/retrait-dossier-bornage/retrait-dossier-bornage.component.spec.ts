import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetraitDossierBornageComponent } from './retrait-dossier-bornage.component';

describe('RetraitDossierBornageComponent', () => {
  let component: RetraitDossierBornageComponent;
  let fixture: ComponentFixture<RetraitDossierBornageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetraitDossierBornageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetraitDossierBornageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
