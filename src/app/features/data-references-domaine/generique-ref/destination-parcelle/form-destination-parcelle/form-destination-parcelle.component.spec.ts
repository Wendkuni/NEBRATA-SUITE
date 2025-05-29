import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDestinationParcelleComponent } from './form-destination-parcelle.component';

describe('FormDestinationParcelleComponent', () => {
  let component: FormDestinationParcelleComponent;
  let fixture: ComponentFixture<FormDestinationParcelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDestinationParcelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDestinationParcelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
