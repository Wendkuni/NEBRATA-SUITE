import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserIndivisionComponent } from './info-user-indivision.component';

describe('InfoUserIndivisionComponent', () => {
  let component: InfoUserIndivisionComponent;
  let fixture: ComponentFixture<InfoUserIndivisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserIndivisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserIndivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
