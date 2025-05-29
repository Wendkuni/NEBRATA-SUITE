import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserAmenagementComponent } from './info-user-amenagement.component';

describe('InfoUserAmenagementComponent', () => {
  let component: InfoUserAmenagementComponent;
  let fixture: ComponentFixture<InfoUserAmenagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserAmenagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserAmenagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
