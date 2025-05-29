import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserReseauxSociauxComponent } from './info-user-reseaux-sociaux.component';

describe('InfoUserReseauxSociauxComponent', () => {
  let component: InfoUserReseauxSociauxComponent;
  let fixture: ComponentFixture<InfoUserReseauxSociauxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserReseauxSociauxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserReseauxSociauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
