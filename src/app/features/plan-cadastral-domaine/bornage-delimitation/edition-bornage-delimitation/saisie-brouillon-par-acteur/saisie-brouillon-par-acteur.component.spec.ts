import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieBrouillonParActeurComponent } from './saisie-brouillon-par-acteur.component';

describe('SaisieBrouillonParActeurComponent', () => {
  let component: SaisieBrouillonParActeurComponent;
  let fixture: ComponentFixture<SaisieBrouillonParActeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaisieBrouillonParActeurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaisieBrouillonParActeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
