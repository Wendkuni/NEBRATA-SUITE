import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolderLiquidationComponent } from './solder-liquidation.component';

describe('SolderLiquidationComponent', () => {
  let component: SolderLiquidationComponent;
  let fixture: ComponentFixture<SolderLiquidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolderLiquidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolderLiquidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
