import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelleDelimitationFormComponent } from './parcelle-delimitation-form.component';

describe('ParcelleDelimitationFormComponent', () => {
  let component: ParcelleDelimitationFormComponent;
  let fixture: ComponentFixture<ParcelleDelimitationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelleDelimitationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelleDelimitationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
