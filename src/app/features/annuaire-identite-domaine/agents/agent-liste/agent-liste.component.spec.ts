import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentListeComponent } from './agent-liste.component';

describe('AgentListeComponent', () => {
  let component: AgentListeComponent;
  let fixture: ComponentFixture<AgentListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentListeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
