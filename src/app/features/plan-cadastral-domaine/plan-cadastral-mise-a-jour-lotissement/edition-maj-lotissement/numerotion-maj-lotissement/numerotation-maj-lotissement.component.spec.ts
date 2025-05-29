import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprouverTravailMorcellementComponent } from './approuver-travail-morcellement.component';

describe('ApprouverTravailMorcellementComponent', () => {
  let component: ApprouverTravailMorcellementComponent;
  let fixture: ComponentFixture<ApprouverTravailMorcellementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprouverTravailMorcellementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprouverTravailMorcellementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
