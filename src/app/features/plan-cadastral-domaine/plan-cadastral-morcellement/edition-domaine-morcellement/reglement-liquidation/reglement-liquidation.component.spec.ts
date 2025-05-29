import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglementLiquidationComponent } from './reglement-liquidation.component';

describe('ReglementLiquidationComponent', () => {
  let component: ReglementLiquidationComponent;
  let fixture: ComponentFixture<ReglementLiquidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReglementLiquidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglementLiquidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
