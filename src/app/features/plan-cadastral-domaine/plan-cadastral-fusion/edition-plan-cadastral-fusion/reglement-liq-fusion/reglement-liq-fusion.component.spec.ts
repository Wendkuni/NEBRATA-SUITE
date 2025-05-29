import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglementLiqFusionComponent } from './reglement-liq-fusion.component';

describe('ReglementLiqFusionComponent', () => {
  let component: ReglementLiqFusionComponent;
  let fixture: ComponentFixture<ReglementLiqFusionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReglementLiqFusionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglementLiqFusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
