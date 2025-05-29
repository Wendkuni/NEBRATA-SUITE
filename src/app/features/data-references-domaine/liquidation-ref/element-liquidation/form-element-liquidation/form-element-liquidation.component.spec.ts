import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormElementLiquidationComponent } from './form-element-liquidation.component';

describe('FormElementLiquidationComponent', () => {
  let component: FormElementLiquidationComponent;
  let fixture: ComponentFixture<FormElementLiquidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormElementLiquidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormElementLiquidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
