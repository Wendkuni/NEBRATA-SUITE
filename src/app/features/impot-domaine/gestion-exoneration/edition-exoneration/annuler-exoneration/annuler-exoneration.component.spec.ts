import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnulerExonerationComponent } from './annuler-exoneration.component';

describe('AnnulerExonerationComponent', () => {
  let component: AnnulerExonerationComponent;
  let fixture: ComponentFixture<AnnulerExonerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnulerExonerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnulerExonerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
