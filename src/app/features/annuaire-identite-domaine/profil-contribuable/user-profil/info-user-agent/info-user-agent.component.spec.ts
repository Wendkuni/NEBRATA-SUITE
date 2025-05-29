import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserAgentComponent } from './info-user-agent.component';

describe('InfoUserAgentComponent', () => {
  let component: InfoUserAgentComponent;
  let fixture: ComponentFixture<InfoUserAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
