import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BornageDossierComponent } from './bornage-dossier.component';

describe('BornageDossierComponent', () => {
  let component: BornageDossierComponent;
  let fixture: ComponentFixture<BornageDossierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BornageDossierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BornageDossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
