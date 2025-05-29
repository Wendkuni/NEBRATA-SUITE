import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriePieceComponent } from './categorie-piece.component';

describe('CategoriePieceIdentiteComponent', () => {
  let component: CategoriePieceComponent;
  let fixture: ComponentFixture<CategoriePieceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriePieceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriePieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
