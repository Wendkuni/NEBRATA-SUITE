import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoiePourValidationComponent } from './envoie-pour-validation.component';

describe('EnvoiePourValidationComponent', () => {
  let component: EnvoiePourValidationComponent;
  let fixture: ComponentFixture<EnvoiePourValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvoiePourValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvoiePourValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
