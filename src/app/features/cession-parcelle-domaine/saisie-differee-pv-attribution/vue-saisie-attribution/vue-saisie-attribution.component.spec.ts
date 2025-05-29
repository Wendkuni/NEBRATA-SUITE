import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VueSaisieAttributionComponent } from './vue-saisie-attribution.component';

describe('VueSaisieAttributionComponent', () => {
  let component: VueSaisieAttributionComponent;
  let fixture: ComponentFixture<VueSaisieAttributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VueSaisieAttributionComponent]
    });
    fixture = TestBed.createComponent(VueSaisieAttributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
