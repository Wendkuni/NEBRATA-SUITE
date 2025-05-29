import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserAdresseComponent } from './info-user-adresse.component';

describe('InfoUserAdresseComponent', () => {
  let component: InfoUserAdresseComponent;
  let fixture: ComponentFixture<InfoUserAdresseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserAdresseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserAdresseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
