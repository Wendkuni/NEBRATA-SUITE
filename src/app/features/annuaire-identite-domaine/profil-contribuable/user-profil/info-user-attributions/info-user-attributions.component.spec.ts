import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserAttributionsComponent } from './info-user-attributions.component';

describe('InfoUserAttributionsComponent', () => {
  let component: InfoUserAttributionsComponent;
  let fixture: ComponentFixture<InfoUserAttributionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserAttributionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserAttributionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
