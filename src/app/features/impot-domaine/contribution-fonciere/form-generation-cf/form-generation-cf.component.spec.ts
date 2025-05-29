import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCategoriePieceComponent } from './form-categorie-piece.component';

describe('FormCategoriePieceIdentiteComponent', () => {
  let component: FormCategoriePieceComponent;
  let fixture: ComponentFixture<FormCategoriePieceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCategoriePieceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCategoriePieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
