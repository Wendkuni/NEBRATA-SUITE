import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilListItemIconComponent } from './profil-list-item-icon.component';

describe('ProfilListItemIconComponent', () => {
  let component: ProfilListItemIconComponent;
  let fixture: ComponentFixture<ProfilListItemIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilListItemIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilListItemIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
