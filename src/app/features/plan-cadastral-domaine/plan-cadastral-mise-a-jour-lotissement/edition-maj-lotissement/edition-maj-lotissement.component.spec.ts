import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionPlanCadastralMiseAJourLotissementComponent } from './edition-maj-lotissement.component';

describe('EditionPlanCadastralMiseAJourLotissementComponent', () => {
  let component: EditionPlanCadastralMiseAJourLotissementComponent;
  let fixture: ComponentFixture<EditionPlanCadastralMiseAJourLotissementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditionPlanCadastralMiseAJourLotissementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionPlanCadastralMiseAJourLotissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
