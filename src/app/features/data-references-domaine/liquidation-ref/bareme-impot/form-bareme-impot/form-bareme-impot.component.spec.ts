import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBaremeImpotComponent } from './form-bareme-impot.component';

describe('FormBaremeImpotComponent', () => {
  let component: FormBaremeImpotComponent;
  let fixture: ComponentFixture<FormBaremeImpotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormBaremeImpotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBaremeImpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
