import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCivilitesComponent } from './form-civilites.component';

describe('FormCivilitesComponent', () => {
  let component: FormCivilitesComponent;
  let fixture: ComponentFixture<FormCivilitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCivilitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCivilitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
