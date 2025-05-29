import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisiePvAttributionComponent } from './saisie-pv-attribution.component';

describe('SaisiePvAttributionComponent', () => {
  let component: SaisiePvAttributionComponent;
  let fixture: ComponentFixture<SaisiePvAttributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaisiePvAttributionComponent]
    });
    fixture = TestBed.createComponent(SaisiePvAttributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
