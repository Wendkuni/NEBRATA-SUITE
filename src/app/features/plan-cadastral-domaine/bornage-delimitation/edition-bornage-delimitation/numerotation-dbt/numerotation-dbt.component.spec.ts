import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumerotationDBTComponent } from './numerotation-dbt.component';

describe('NumerotationDBTComponent', () => {
  let component: NumerotationDBTComponent;
  let fixture: ComponentFixture<NumerotationDBTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumerotationDBTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumerotationDBTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
