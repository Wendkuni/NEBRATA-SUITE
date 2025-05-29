import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieParAgentComponent } from './saisie-par-agent.component';

describe('SaisieParAgentComponent', () => {
  let component: SaisieParAgentComponent;
  let fixture: ComponentFixture<SaisieParAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaisieParAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaisieParAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
