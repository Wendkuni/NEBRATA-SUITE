import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriePieceProcessusComponent } from './categorie-piece-processus.component';

describe('CategoriePieceProcessusComponent', () => {
  let component: CategoriePieceProcessusComponent;
  let fixture: ComponentFixture<CategoriePieceProcessusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriePieceProcessusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriePieceProcessusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
