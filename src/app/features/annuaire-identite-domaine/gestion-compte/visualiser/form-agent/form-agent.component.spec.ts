import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAgentComponent } from './form-agent.component';

describe('FormAgentComponent', () => {
  let component: FormAgentComponent;
  let fixture: ComponentFixture<FormAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
