import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSystemImpositionComponent } from './form-system-imposition.component';

describe('FormSystemImpositionComponent', () => {
  let component: FormSystemImpositionComponent;
  let fixture: ComponentFixture<FormSystemImpositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormSystemImpositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSystemImpositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
