import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectationDMComponent } from './affectation-dm.component';

describe('AffectationDMComponent', () => {
  let component: AffectationDMComponent;
  let fixture: ComponentFixture<AffectationDMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffectationDMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectationDMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
