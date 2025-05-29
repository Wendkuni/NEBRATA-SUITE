import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PCSecCompleterAvantValidationComponent } from './completer-avant-validation.component';

describe('CompleterAvantValidationComponent', () => {
  let component: PCSecCompleterAvantValidationComponent;
  let fixture: ComponentFixture<PCSecCompleterAvantValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PCSecCompleterAvantValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PCSecCompleterAvantValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
