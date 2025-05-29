import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglementLiqBornageComponent } from './reglement-liq-bornage.component';

describe('ReglementLiqBornageComponent', () => {
  let component: ReglementLiqBornageComponent;
  let fixture: ComponentFixture<ReglementLiqBornageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReglementLiqBornageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglementLiqBornageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
