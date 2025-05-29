import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCessionSourceComponent } from './form-cession-source.component';

describe('FormCessionSourceComponent', () => {
  let component: FormCessionSourceComponent;
  let fixture: ComponentFixture<FormCessionSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCessionSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCessionSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
