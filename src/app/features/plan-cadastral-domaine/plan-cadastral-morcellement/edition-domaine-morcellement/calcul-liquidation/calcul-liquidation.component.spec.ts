import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculLiquidationComponent } from './calcul-liquidation.component';

describe('CalculLiquidationComponent', () => {
  let component: CalculLiquidationComponent;
  let fixture: ComponentFixture<CalculLiquidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculLiquidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculLiquidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
