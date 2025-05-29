import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieActeurComponent } from './categorie-acteur.component';

describe('CategorieActeurComponent', () => {
  let component: CategorieActeurComponent;
  let fixture: ComponentFixture<CategorieActeurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorieActeurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorieActeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
