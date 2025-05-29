import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserLotissementComponent } from './info-user-lotissement.component';

describe('InfoUserLotissementComponent', () => {
  let component: InfoUserLotissementComponent;
  let fixture: ComponentFixture<InfoUserLotissementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserLotissementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserLotissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
