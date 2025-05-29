import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlotsAModifierComponent } from './ilots-amodifier.component';

describe('IlotsAModifierComponent', () => {
  let component: IlotsAModifierComponent;
  let fixture: ComponentFixture<IlotsAModifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IlotsAModifierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IlotsAModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
