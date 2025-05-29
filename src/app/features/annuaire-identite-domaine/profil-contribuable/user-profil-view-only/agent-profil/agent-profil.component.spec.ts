import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentProfilComponent } from './agent-profil.component';

describe('AgentProfilComponent', () => {
  let component: AgentProfilComponent;
  let fixture: ComponentFixture<AgentProfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentProfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
