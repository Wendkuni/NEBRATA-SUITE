import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserTelephoneComponent } from './info-user-telephone.component';

describe('InfoUserTelephoneComponent', () => {
  let component: InfoUserTelephoneComponent;
  let fixture: ComponentFixture<InfoUserTelephoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserTelephoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserTelephoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
