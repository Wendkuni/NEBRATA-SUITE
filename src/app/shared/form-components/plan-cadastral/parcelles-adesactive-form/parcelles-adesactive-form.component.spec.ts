import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcellesADesactiveFormComponent } from './parcelles-adesactive-form.component';

describe('ParcellesADesactiveFormComponent', () => {
  let component: ParcellesADesactiveFormComponent;
  let fixture: ComponentFixture<ParcellesADesactiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcellesADesactiveFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcellesADesactiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
