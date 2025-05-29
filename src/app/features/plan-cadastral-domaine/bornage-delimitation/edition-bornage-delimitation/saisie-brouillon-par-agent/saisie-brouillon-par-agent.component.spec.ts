import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieBrouillonParAgentComponent } from './saisie-brouillon-par-agent.component';

describe('SaisieBrouillonParAgentComponent', () => {
  let component: SaisieBrouillonParAgentComponent;
  let fixture: ComponentFixture<SaisieBrouillonParAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaisieBrouillonParAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaisieBrouillonParAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
