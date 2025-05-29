import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomaineMorcellementComponent } from './domaine-morcellement.component';

describe('DomaineMorcellementComponent', () => {
  let component: DomaineMorcellementComponent;
  let fixture: ComponentFixture<DomaineMorcellementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomaineMorcellementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomaineMorcellementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
