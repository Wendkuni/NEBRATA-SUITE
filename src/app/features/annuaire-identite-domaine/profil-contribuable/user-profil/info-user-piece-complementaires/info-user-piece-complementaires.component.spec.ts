import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserPieceComplementairesComponent } from './info-user-piece-complementaires.component';

describe('InfoUserPieceComplementairesComponent', () => {
  let component: InfoUserPieceComplementairesComponent;
  let fixture: ComponentFixture<InfoUserPieceComplementairesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserPieceComplementairesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserPieceComplementairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
