import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieBrouillonParContribuableComponent } from './saisie-brouillon-par-contribuable.component';

describe('SaisieBrouillonParContribuableComponent', () => {
  let component: SaisieBrouillonParContribuableComponent;
  let fixture: ComponentFixture<SaisieBrouillonParContribuableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaisieBrouillonParContribuableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaisieBrouillonParContribuableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
