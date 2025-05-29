import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserFusionComponent } from './info-user-fusion.component';

describe('InfoUserFusionComponent', () => {
  let component: InfoUserFusionComponent;
  let fixture: ComponentFixture<InfoUserFusionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserFusionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserFusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
