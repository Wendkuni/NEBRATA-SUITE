import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectationDBTComponent } from './affectation-dbt.component';

describe('AffectationDBTComponent', () => {
  let component: AffectationDBTComponent;
  let fixture: ComponentFixture<AffectationDBTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffectationDBTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectationDBTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
