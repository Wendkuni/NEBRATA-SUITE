import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  VueSdMajPlanComponent } from './vue-sd-maj-plan.component';



describe('VueSdMajPlanComponent', () => {
  let component: VueSdMajPlanComponent;
  let fixture: ComponentFixture<VueSdMajPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VueSdMajPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VueSdMajPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
