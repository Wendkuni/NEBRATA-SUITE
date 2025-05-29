import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaremeImpotComponent } from './bareme-impot.component';

describe('BaremeImpotComponent', () => {
  let component: BaremeImpotComponent;
  let fixture: ComponentFixture<BaremeImpotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaremeImpotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaremeImpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
