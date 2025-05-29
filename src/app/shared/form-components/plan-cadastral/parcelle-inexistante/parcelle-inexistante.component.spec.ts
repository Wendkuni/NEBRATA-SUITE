import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelleInexistanteComponent } from './parcelle-inexistante.component';

describe('ParcelleInexistanteComponent', () => {
  let component: ParcelleInexistanteComponent;
  let fixture: ComponentFixture<ParcelleInexistanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelleInexistanteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParcelleInexistanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
