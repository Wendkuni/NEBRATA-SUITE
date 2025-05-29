import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnulerMandatComponent } from './annuler-mandat.component';

describe('CreerParContribuableComponent', () => {
  let component: AnnulerMandatComponent;
  let fixture: ComponentFixture<AnnulerMandatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnulerMandatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnulerMandatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
