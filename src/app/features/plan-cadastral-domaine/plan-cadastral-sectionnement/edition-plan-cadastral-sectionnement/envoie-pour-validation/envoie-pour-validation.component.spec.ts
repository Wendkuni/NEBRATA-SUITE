import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PCSecEnvoiePourValidationComponent } from './envoie-pour-validation.component';

describe('EnvoiePourValidationComponent', () => {
  let component: PCSecEnvoiePourValidationComponent;
  let fixture: ComponentFixture<PCSecEnvoiePourValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PCSecEnvoiePourValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PCSecEnvoiePourValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
