import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocagePvAttributionComponent } from './blocage-pv-attribution.component';

describe('BlocagePvAttributionComponent', () => {
  let component: BlocagePvAttributionComponent;
  let fixture: ComponentFixture<BlocagePvAttributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlocagePvAttributionComponent]
    });
    fixture = TestBed.createComponent(BlocagePvAttributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
