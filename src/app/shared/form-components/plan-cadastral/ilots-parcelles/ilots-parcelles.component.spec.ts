import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlotsParcellesComponent } from './ilots-parcelles.component';

describe('IlotsParcellesComponent', () => {
  let component: IlotsParcellesComponent;
  let fixture: ComponentFixture<IlotsParcellesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IlotsParcellesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IlotsParcellesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
