import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VueMiseAJourLotissementComponent } from './vue-mise-a-jour-lotissement.component';

describe('VueMiseAJourLotissementComponent', () => {
  let component: VueMiseAJourLotissementComponent;
  let fixture: ComponentFixture<VueMiseAJourLotissementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VueMiseAJourLotissementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VueMiseAJourLotissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
