import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprouverTravailFusionComponent } from './approuver-travail-fusion.component';

describe('ApprouverTravailFusionnementComponent', () => {
  let component: ApprouverTravailFusionComponent;
  let fixture: ComponentFixture<ApprouverTravailFusionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprouverTravailFusionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprouverTravailFusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
