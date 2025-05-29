import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserContributionFonciereComponent } from './info-user-contribution-fonciere.component';

describe('InfoUserContributionFonciereComponent', () => {
  let component: InfoUserContributionFonciereComponent;
  let fixture: ComponentFixture<InfoUserContributionFonciereComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserContributionFonciereComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserContributionFonciereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
