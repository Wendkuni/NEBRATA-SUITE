import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementLiquidationComponent } from './element-liquidation.component';

describe('ElementLiquidationComponent', () => {
  let component: ElementLiquidationComponent;
  let fixture: ComponentFixture<ElementLiquidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementLiquidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementLiquidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
