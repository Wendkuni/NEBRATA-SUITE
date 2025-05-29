import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserBornagesComponent } from './info-user-bornages.component';

describe('InfoUserBornagesComponent', () => {
  let component: InfoUserBornagesComponent;
  let fixture: ComponentFixture<InfoUserBornagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserBornagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserBornagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
