import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LotissementComponent } from './lotissement.component';

describe('PlanCadastralLotissementComponent', () => {
  let component: LotissementComponent;
  let fixture: ComponentFixture<LotissementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LotissementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
