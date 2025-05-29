import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculLiqFusionComponent } from './calcul-liq-fusion.component';

describe('CalculLiqFusionComponent', () => {
  let component: CalculLiqFusionComponent;
  let fixture: ComponentFixture<CalculLiqFusionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculLiqFusionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculLiqFusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
