import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationParAgentComponent } from './creation-par-agent.component';

describe('CreationParAgentComponent', () => {
  let component: CreationParAgentComponent;
  let fixture: ComponentFixture<CreationParAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationParAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationParAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
