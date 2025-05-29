import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormActeurComponent } from './form-acteur.component';

describe('FormActeurComponent', () => {
  let component: FormActeurComponent;
  let fixture: ComponentFixture<FormActeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormActeurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormActeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
