import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPagesServicesComponent } from './form-pages-services.component';

describe('FormPagesServicesComponent', () => {
  let component: FormPagesServicesComponent;
  let fixture: ComponentFixture<FormPagesServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPagesServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPagesServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
