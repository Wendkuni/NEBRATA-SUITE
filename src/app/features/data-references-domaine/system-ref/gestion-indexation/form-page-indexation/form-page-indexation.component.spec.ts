import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPageIndexationComponent } from './form-page-indexation.component';

describe('FormPageIndexationComponent', () => {
  let component: FormPageIndexationComponent;
  let fixture: ComponentFixture<FormPageIndexationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPageIndexationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPageIndexationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
