import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuableMoralFormPageComponent } from './contribuable-moral-form-page.component';

describe('ContribuableMoralFormPageComponent', () => {
  let component: ContribuableMoralFormPageComponent;
  let fixture: ComponentFixture<ContribuableMoralFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribuableMoralFormPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribuableMoralFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
