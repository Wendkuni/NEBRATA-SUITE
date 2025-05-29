import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuablePhysiqueProfilComponent } from './contribuable-physique-profil.component';

describe('ContribuablePhysiqueProfilComponent', () => {
  let component: ContribuablePhysiqueProfilComponent;
  let fixture: ComponentFixture<ContribuablePhysiqueProfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribuablePhysiqueProfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribuablePhysiqueProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
