import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserParentsComponent } from './info-user-parents.component';

describe('InfoUserParentsComponent', () => {
  let component: InfoUserParentsComponent;
  let fixture: ComponentFixture<InfoUserParentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserParentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserParentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
