import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditionSdMajPlanComponent } from './edition-sd-maj-plan.component';


describe('EditionSdMajPlanComponent', () => {
  let component: EditionSdMajPlanComponent;
  let fixture: ComponentFixture<EditionSdMajPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditionSdMajPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionSdMajPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
