import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNationaliteComponent } from './form-nationalite.component';

describe('FormNationaliteComponent', () => {
  let component: FormNationaliteComponent;
  let fixture: ComponentFixture<FormNationaliteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormNationaliteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNationaliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
