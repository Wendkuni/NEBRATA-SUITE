import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionDomaineMorcellementComponent } from './edition-domaine-morcellement.component';

describe('EditionDomaineMorcellementComponent', () => {
  let component: EditionDomaineMorcellementComponent;
  let fixture: ComponentFixture<EditionDomaineMorcellementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditionDomaineMorcellementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionDomaineMorcellementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
