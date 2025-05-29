import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelleFormAjouterComponent } from './parcelle-form-ajouter.component';

describe('ParcelleFormAjouterComponent', () => {
  let component: ParcelleFormAjouterComponent;
  let fixture: ComponentFixture<ParcelleFormAjouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelleFormAjouterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelleFormAjouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
