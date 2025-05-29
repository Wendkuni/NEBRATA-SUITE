import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleterAvantValidationComponent } from './completer-avant-validation.component';

describe('CompleterAvantValidationComponent', () => {
  let component: CompleterAvantValidationComponent;
  let fixture: ComponentFixture<CompleterAvantValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleterAvantValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleterAvantValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
