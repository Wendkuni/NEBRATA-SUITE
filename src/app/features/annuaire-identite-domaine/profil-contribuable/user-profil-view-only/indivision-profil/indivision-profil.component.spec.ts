import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndivisionProfilComponent } from './indivision-profil.component';

describe('IndivisionProfilComponent', () => {
  let component: IndivisionProfilComponent;
  let fixture: ComponentFixture<IndivisionProfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndivisionProfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndivisionProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
