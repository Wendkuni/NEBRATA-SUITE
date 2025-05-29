import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionContributionFonciereComponent } from './edition-contribution-fonciere.component';

describe('EditionContributionFonciereComponent', () => {
  let component: EditionContributionFonciereComponent;
  let fixture: ComponentFixture<EditionContributionFonciereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditionContributionFonciereComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionContributionFonciereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
