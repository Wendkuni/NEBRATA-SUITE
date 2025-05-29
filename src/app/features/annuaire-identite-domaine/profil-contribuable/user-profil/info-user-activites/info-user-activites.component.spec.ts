import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserActivitesComponent } from './info-user-activites.component';

describe('InfoUserActivitesComponent', () => {
  let component: InfoUserActivitesComponent;
  let fixture: ComponentFixture<InfoUserActivitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserActivitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserActivitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
