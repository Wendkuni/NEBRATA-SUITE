import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcellePopupComponent } from './parcelle-popup.component';

describe('ParcellePopupComponent', () => {
  let component: ParcellePopupComponent;
  let fixture: ComponentFixture<ParcellePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcellePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcellePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
