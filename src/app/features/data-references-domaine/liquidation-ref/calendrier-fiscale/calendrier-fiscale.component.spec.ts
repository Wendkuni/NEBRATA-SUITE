import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendrierFiscaleComponent } from './calendrier-fiscale.component';

describe('CalendrierFiscaleComponent', () => {
  let component: CalendrierFiscaleComponent;
  let fixture: ComponentFixture<CalendrierFiscaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendrierFiscaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendrierFiscaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
