import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcellesAModifierFormComponent } from './parcelles-amodifier-form.component';

describe('ParcellesAModifierFormComponent', () => {
  let component: ParcellesAModifierFormComponent;
  let fixture: ComponentFixture<ParcellesAModifierFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcellesAModifierFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcellesAModifierFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
