import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCadastralFusionnementComponent } from './plan-cadastral-fusionnement.component';

describe('PlanCadastralFusionnementComponent', () => {
  let component: PlanCadastralFusionnementComponent;
  let fixture: ComponentFixture<PlanCadastralFusionnementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanCadastralFusionnementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanCadastralFusionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
