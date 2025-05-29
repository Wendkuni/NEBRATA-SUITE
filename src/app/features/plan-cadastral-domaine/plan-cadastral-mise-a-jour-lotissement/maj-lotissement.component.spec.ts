import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCadastralMiseAJourLotissementComponent } from './plan-cadastral-mise-a-jour-lotissement.component';

describe('PlanCadastralMiseAJourLotissementComponent', () => {
  let component: PlanCadastralMiseAJourLotissementComponent;
  let fixture: ComponentFixture<PlanCadastralMiseAJourLotissementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanCadastralMiseAJourLotissementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanCadastralMiseAJourLotissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
