import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlotsADesactiveFormComponent } from './ilots-adesactive-form.component';

describe('IlotsADesactiveFormComponent', () => {
  let component: IlotsADesactiveFormComponent;
  let fixture: ComponentFixture<IlotsADesactiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IlotsADesactiveFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IlotsADesactiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
