import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationMatrimonialeComponent } from './situation-matrimoniale.component';

describe('SituationMatrimonialeComponent', () => {
  let component: SituationMatrimonialeComponent;
  let fixture: ComponentFixture<SituationMatrimonialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SituationMatrimonialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SituationMatrimonialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
