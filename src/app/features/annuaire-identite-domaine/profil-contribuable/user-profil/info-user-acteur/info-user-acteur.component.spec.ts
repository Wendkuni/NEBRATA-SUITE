import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserActeurComponent } from './info-user-acteur.component';

describe('InfoUserActeurComponent', () => {
  let component: InfoUserActeurComponent;
  let fixture: ComponentFixture<InfoUserActeurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserActeurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserActeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
