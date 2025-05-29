import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserMiseAJourComponent } from './info-user-mise-a-jour.component';

describe('InfoUserMiseAJourComponent', () => {
  let component: InfoUserMiseAJourComponent;
  let fixture: ComponentFixture<InfoUserMiseAJourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserMiseAJourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserMiseAJourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
