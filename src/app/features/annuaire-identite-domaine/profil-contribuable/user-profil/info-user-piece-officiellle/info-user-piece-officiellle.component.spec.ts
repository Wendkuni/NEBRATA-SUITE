import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserPieceOfficiellleComponent } from './info-user-piece-officiellle.component';

describe('InfoUserPieceOfficiellleComponent', () => {
  let component: InfoUserPieceOfficiellleComponent;
  let fixture: ComponentFixture<InfoUserPieceOfficiellleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserPieceOfficiellleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserPieceOfficiellleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
