import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Vue360Component } from './vue360.component';

describe('Vue360Component', () => {
  let component: Vue360Component;
  let fixture: ComponentFixture<Vue360Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Vue360Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Vue360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
