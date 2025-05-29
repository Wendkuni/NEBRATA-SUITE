import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilListItemValueComponent } from './profil-list-item-value.component';

describe('ProfilListItemValueComponent', () => {
  let component: ProfilListItemValueComponent;
  let fixture: ComponentFixture<ProfilListItemValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilListItemValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilListItemValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
