import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejetSaisieAmenagementComponent } from './rejet-saisie-amenagement.component';

describe('RejetSaisieLotissementComponent', () => {
  let component: RejetSaisieAmenagementComponent;
  let fixture: ComponentFixture<RejetSaisieAmenagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejetSaisieAmenagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejetSaisieAmenagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
