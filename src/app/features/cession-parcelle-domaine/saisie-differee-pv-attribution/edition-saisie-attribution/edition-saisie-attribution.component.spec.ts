import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionSaisieAttributionComponent } from './edition-saisie-attribution.component';

describe('EditionSaisieAttributionComponent', () => {
  let component: EditionSaisieAttributionComponent;
  let fixture: ComponentFixture<EditionSaisieAttributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditionSaisieAttributionComponent]
    });
    fixture = TestBed.createComponent(EditionSaisieAttributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
