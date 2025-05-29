import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdresseEditionComponent } from './adresse-edition.component';

describe('AdresseEditionComponent', () => {
  let component: AdresseEditionComponent;
  let fixture: ComponentFixture<AdresseEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdresseEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdresseEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
