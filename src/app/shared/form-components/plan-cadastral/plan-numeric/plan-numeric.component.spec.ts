import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanNumericComponent } from './plan-numeric.component';

describe('PlanNumericComponent', () => {
  let component: PlanNumericComponent;
  let fixture: ComponentFixture<PlanNumericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanNumericComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanNumericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
