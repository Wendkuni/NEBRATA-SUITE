import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectationDmajComponent } from './afffectation-dmaj.component';

describe('AffectationDmajComponent', () => {
  let component: AffectationDmajComponent;
  let fixture: ComponentFixture<AffectationDmajComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffectationDmajComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectationDmajComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
