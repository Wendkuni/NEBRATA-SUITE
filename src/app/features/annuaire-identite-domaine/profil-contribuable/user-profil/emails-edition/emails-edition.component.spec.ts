import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsEditionComponent } from './emails-edition.component';

describe('EmailsEditionComponent', () => {
  let component: EmailsEditionComponent;
  let fixture: ComponentFixture<EmailsEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailsEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
