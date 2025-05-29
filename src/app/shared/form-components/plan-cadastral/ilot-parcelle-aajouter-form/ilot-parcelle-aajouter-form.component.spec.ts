import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlotParcelleAajouterFormComponent } from './ilot-parcelle-aajouter-form.component';

describe('IlotParcelleAajouterFormComponent', () => {
  let component: IlotParcelleAajouterFormComponent;
  let fixture: ComponentFixture<IlotParcelleAajouterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IlotParcelleAajouterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IlotParcelleAajouterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
