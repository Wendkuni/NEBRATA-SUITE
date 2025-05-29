import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserContibuableMoraleComponent } from './info-user-contibuable-morale.component';

describe('InfoUserContibuableMoraleComponent', () => {
  let component: InfoUserContibuableMoraleComponent;
  let fixture: ComponentFixture<InfoUserContibuableMoraleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserContibuableMoraleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserContibuableMoraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
