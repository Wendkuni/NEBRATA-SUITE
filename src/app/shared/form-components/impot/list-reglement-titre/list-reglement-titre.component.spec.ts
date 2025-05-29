import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReglementTitreComponent } from './list-reglement-titre.component';

describe('ListReglementTitreComponent', () => {
  let component: ListReglementTitreComponent;
  let fixture: ComponentFixture<ListReglementTitreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListReglementTitreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReglementTitreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
