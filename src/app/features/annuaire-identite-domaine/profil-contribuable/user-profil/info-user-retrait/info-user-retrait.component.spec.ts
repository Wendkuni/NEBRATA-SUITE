import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserRetraitComponent } from './info-user-retrait.component';

describe('InfoUserRetraitComponent', () => {
  let component: InfoUserRetraitComponent;
  let fixture: ComponentFixture<InfoUserRetraitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserRetraitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserRetraitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
