import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationAmenagementComponent } from './creation-amenagement.component';

describe('CreationLotissementComponent', () => {
  let component: CreationAmenagementComponent;
  let fixture: ComponentFixture<CreationAmenagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationAmenagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationAmenagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
