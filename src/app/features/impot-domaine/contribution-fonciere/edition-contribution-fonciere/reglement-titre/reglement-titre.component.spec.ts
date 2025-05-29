import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglementTitreComponent } from './reglement-titre.component';

describe('ReglementTitreComponent', () => {
  let component: ReglementTitreComponent;
  let fixture: ComponentFixture<ReglementTitreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReglementTitreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglementTitreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
