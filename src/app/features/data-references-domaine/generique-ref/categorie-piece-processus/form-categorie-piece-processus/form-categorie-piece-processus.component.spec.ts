import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCategoriePieceProcessusComponent } from './form-categorie-piece-processus.component';

describe('FormCategoriePieceProcessusComponent', () => {
  let component: FormCategoriePieceProcessusComponent;
  let fixture: ComponentFixture<FormCategoriePieceProcessusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCategoriePieceProcessusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCategoriePieceProcessusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
