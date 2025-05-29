import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieDiffereePvAttributionComponent } from './saisie-differee-pv-attribution.component';

describe('SaisieDiffereePvAttributionComponent', () => {
  let component: SaisieDiffereePvAttributionComponent;
  let fixture: ComponentFixture<SaisieDiffereePvAttributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaisieDiffereePvAttributionComponent]
    });
    fixture = TestBed.createComponent(SaisieDiffereePvAttributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
