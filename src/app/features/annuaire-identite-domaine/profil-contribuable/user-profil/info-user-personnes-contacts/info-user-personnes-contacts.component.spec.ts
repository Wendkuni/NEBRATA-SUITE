import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserPersonnesContactsComponent } from './info-user-personnes-contacts.component';

describe('InfoUserPersonnesContactsComponent', () => {
  let component: InfoUserPersonnesContactsComponent;
  let fixture: ComponentFixture<InfoUserPersonnesContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserPersonnesContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserPersonnesContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
