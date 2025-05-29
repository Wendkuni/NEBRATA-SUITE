import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationSaisiePvAttributionComponent } from './creation-saisie-pv-attribution.component';

describe('CreationSaisiePvAttributionComponent', () => {
  let component: CreationSaisiePvAttributionComponent;
  let fixture: ComponentFixture<CreationSaisiePvAttributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreationSaisiePvAttributionComponent]
    });
    fixture = TestBed.createComponent(CreationSaisiePvAttributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
