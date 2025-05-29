import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNatureImpotComponent } from './form-nature-impot.component';

describe('FormNatureImpotComponent', () => {
  let component: FormNatureImpotComponent;
  let fixture: ComponentFixture<FormNatureImpotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormNatureImpotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNatureImpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
