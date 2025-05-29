import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VueContributionFonciereComponent } from './vue-contribution-fonciere.component';

describe('VueContributionFonciereComponent', () => {
  let component: VueContributionFonciereComponent;
  let fixture: ComponentFixture<VueContributionFonciereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VueContributionFonciereComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VueContributionFonciereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
