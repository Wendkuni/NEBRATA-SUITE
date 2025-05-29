import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTitreHonorifiqueComponent } from './form-titre-honorifique.component';

describe('FormTitreHonorifiqueComponent', () => {
  let component: FormTitreHonorifiqueComponent;
  let fixture: ComponentFixture<FormTitreHonorifiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTitreHonorifiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTitreHonorifiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
