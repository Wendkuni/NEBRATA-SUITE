import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelleFormFusionComponent } from './parcelle-form-fusion.component';

describe('ParcelleFormFusionComponent', () => {
  let component: ParcelleFormFusionComponent;
  let fixture: ComponentFixture<ParcelleFormFusionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelleFormFusionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelleFormFusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
