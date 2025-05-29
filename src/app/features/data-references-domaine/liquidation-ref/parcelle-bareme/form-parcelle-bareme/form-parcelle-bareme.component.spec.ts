import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormParcelleBaremeComponent } from './form-parcelle-bareme.component';

describe('FormParcelleBaremeComponent', () => {
  let component: FormParcelleBaremeComponent;
  let fixture: ComponentFixture<FormParcelleBaremeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormParcelleBaremeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormParcelleBaremeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
