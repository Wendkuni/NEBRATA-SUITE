import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdMajPlanComponent } from './sd-maj-plan.component';

describe('PlanCadastralMiseAJourLotissementComponent', () => {
  let component: SdMajPlanComponent;
  let fixture: ComponentFixture<SdMajPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdMajPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdMajPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
