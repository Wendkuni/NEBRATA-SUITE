import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiseAJourPlanComponent } from './mise-ajour-plan.component';

describe('MiseAJourPlanComponent', () => {
  let component: MiseAJourPlanComponent;
  let fixture: ComponentFixture<MiseAJourPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiseAJourPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiseAJourPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
