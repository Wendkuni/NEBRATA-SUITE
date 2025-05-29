import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieBrouilonParAgentComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-mise-a-jour-lotissement/edition-maj-lotissement/saisie-par-agent/saisie-brouilon-par-agent.component';

describe('SaisieBrouilonParAgentComponent', () => {
  let component: SaisieBrouilonParAgentComponent;
  let fixture: ComponentFixture<SaisieBrouilonParAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaisieBrouilonParAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaisieBrouilonParAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
