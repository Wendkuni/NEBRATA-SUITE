import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlotParcelleAajouterComponent } from './ilot-parcelle-aajouter.component';

describe('IlotParcelleAajouterComponent', () => {
  let component: IlotParcelleAajouterComponent;
  let fixture: ComponentFixture<IlotParcelleAajouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IlotParcelleAajouterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IlotParcelleAajouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
