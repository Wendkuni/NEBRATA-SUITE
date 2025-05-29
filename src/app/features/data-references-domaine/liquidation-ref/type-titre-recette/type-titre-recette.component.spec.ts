import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeTitreRecetteComponent } from './type-titre-recette.component';

describe('TypeTitreRecetteComponent', () => {
  let component: TypeTitreRecetteComponent;
  let fixture: ComponentFixture<TypeTitreRecetteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeTitreRecetteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeTitreRecetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
