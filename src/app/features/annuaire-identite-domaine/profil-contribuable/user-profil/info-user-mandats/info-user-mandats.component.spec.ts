import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserMandatsComponent } from './info-user-mandats.component';

describe('InfoUserMandatsComponent', () => {
  let component: InfoUserMandatsComponent;
  let fixture: ComponentFixture<InfoUserMandatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserMandatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserMandatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
