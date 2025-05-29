import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelleVisualiserComponent } from './parcelle-visualiser.component';

describe('ParcelleVisualiserComponent', () => {
  let component: ParcelleVisualiserComponent;
  let fixture: ComponentFixture<ParcelleVisualiserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelleVisualiserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelleVisualiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
