import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlotsParcellesFormComponent } from './ilots-parcelles-form.component';

describe('IlotsParcellesFormComponent', () => {
  let component: IlotsParcellesFormComponent;
  let fixture: ComponentFixture<IlotsParcellesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IlotsParcellesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IlotsParcellesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
