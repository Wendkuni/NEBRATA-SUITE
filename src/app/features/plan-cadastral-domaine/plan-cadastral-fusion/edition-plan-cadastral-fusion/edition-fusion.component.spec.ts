import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionPlanCadastralFusionnementComponent } from './edition-plan-cadastral-fusionnement.component';

describe('EditionPlanCadastralFusionnementComponent', () => {
  let component: EditionPlanCadastralFusionnementComponent;
  let fixture: ComponentFixture<EditionPlanCadastralFusionnementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditionPlanCadastralFusionnementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionPlanCadastralFusionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
