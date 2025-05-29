import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieImmeubleComponent } from './categorie-immeuble.component';

describe('CategorieImmeubleComponent', () => {
  let component: CategorieImmeubleComponent;
  let fixture: ComponentFixture<CategorieImmeubleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorieImmeubleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorieImmeubleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
