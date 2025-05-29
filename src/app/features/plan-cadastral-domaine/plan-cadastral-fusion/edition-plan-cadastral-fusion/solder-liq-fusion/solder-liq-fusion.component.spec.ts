import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolderLiqFusionComponent } from './solder-liq-fusion.component';

describe('SolderLiqFusionComponent', () => {
  let component: SolderLiqFusionComponent;
  let fixture: ComponentFixture<SolderLiqFusionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolderLiqFusionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolderLiqFusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
