import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleterSaisieComponent } from './completer-saisie.component';

describe('CompleterSaisieComponent', () => {
  let component: CompleterSaisieComponent;
  let fixture: ComponentFixture<CompleterSaisieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleterSaisieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleterSaisieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
