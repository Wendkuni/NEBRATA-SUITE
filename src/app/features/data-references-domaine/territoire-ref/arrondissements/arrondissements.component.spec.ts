import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrondissementsComponent } from './arrondissements.component';

describe('ArrondissementsComponent', () => {
  let component: ArrondissementsComponent;
  let fixture: ComponentFixture<ArrondissementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrondissementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrondissementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
