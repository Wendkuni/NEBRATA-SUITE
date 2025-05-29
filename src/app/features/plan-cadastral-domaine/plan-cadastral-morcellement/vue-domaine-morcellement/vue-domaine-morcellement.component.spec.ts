import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VueDomaineMorcellementComponent } from './vue-domaine-morcellement.component';

describe('VueDomaineMorcellementComponent', () => {
  let component: VueDomaineMorcellementComponent;
  let fixture: ComponentFixture<VueDomaineMorcellementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VueDomaineMorcellementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VueDomaineMorcellementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
