import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActeurProfilComponent } from './acteur-profil.component';

describe('ActeurProfilComponent', () => {
  let component: ActeurProfilComponent;
  let fixture: ComponentFixture<ActeurProfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActeurProfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActeurProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
