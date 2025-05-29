import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuableMoralProfilComponent } from './contribuable-moral-profil.component';

describe('ContribuableMoralProfilComponent', () => {
  let component: ContribuableMoralProfilComponent;
  let fixture: ComponentFixture<ContribuableMoralProfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribuableMoralProfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribuableMoralProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
