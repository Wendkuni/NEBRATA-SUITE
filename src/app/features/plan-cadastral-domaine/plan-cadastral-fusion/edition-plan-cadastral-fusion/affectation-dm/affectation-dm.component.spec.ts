import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectationDmComponent } from './affectation-dm.component';

describe('AffectationDmComponent', () => {
  let component: AffectationDmComponent;
  let fixture: ComponentFixture<AffectationDmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffectationDmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectationDmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
