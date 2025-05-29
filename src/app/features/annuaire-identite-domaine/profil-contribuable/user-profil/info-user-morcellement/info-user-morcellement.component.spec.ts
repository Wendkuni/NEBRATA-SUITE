import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserMorcellementComponent } from './info-user-morcellement.component';

describe('InfoUserMorcellementComponent', () => {
  let component: InfoUserMorcellementComponent;
  let fixture: ComponentFixture<InfoUserMorcellementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserMorcellementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserMorcellementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
