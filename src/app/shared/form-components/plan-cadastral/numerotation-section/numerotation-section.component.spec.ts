import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumerotationSectionComponent } from './numerotation-section.component';

describe('NumerotationSectionComponent', () => {
  let component: NumerotationSectionComponent;
  let fixture: ComponentFixture<NumerotationSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumerotationSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumerotationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
