import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserEmailsComponent } from './info-user-emails.component';

describe('InfoUserEmailsComponent', () => {
  let component: InfoUserEmailsComponent;
  let fixture: ComponentFixture<InfoUserEmailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserEmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
