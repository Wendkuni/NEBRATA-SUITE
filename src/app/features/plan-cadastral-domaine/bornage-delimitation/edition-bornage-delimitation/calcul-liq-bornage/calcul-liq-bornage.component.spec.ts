import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculLiqBornageComponent } from './calcul-liq-bornage.component';

describe('CalculLiqBornageComponent', () => {
  let component: CalculLiqBornageComponent;
  let fixture: ComponentFixture<CalculLiqBornageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculLiqBornageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculLiqBornageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
