import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpConfigComponent } from './otp-config.component';

describe('OtpConfigComponent', () => {
  let component: OtpConfigComponent;
  let fixture: ComponentFixture<OtpConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
