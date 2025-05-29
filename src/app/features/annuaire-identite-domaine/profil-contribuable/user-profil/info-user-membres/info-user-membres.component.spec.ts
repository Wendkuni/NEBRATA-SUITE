import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserMembresComponent } from './info-user-membres.component';

describe('InfoUserMembresComponent', () => {
  let component: InfoUserMembresComponent;
  let fixture: ComponentFixture<InfoUserMembresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserMembresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserMembresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
