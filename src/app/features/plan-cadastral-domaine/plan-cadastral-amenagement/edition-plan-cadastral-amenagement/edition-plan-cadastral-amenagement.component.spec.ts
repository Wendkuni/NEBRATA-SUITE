import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionPlanCadastralLotissementComponent } from './edition-plan-cadastral-lotissement.component';

describe('EditionPlanCadastralLotissementComponent', () => {
  let component: EditionPlanCadastralLotissementComponent;
  let fixture: ComponentFixture<EditionPlanCadastralLotissementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditionPlanCadastralLotissementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionPlanCadastralLotissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
