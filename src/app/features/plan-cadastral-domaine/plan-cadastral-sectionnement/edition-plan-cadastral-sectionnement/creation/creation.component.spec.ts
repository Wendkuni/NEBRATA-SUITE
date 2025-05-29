import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PCSecCreationComponent } from './creation.component';

describe('CreationComponent', () => {
  let component: PCSecCreationComponent;
  let fixture: ComponentFixture<PCSecCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PCSecCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PCSecCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
