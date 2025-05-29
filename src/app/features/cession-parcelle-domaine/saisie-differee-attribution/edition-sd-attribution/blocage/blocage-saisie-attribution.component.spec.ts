import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocageSaisieAttributionComponent } from './blocage-saisie-attribution.component';

describe('BlocageSaisieAttributionComponent', () => {
  let component: BlocageSaisieAttributionComponent;
  let fixture: ComponentFixture<BlocageSaisieAttributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlocageSaisieAttributionComponent]
    });
    fixture = TestBed.createComponent(BlocageSaisieAttributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
