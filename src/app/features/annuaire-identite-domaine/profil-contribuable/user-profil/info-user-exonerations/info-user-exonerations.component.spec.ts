import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserExonerationsComponent } from './info-user-exonerations.component';

describe('InfoUserExonerationsComponent', () => {
  let component: InfoUserExonerationsComponent;
  let fixture: ComponentFixture<InfoUserExonerationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserExonerationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserExonerationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
