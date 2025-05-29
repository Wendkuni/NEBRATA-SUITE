import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProvincesComponent } from './form-provinces.component';

describe('FormProvincesComponent', () => {
  let component: FormProvincesComponent;
  let fixture: ComponentFixture<FormProvincesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormProvincesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProvincesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
