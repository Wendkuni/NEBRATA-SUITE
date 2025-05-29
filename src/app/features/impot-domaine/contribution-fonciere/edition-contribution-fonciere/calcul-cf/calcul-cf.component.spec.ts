import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculCFComponent } from './calcul-cf.component';

describe('CalculCFComponent', () => {
  let component: CalculCFComponent;
  let fixture: ComponentFixture<CalculCFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculCFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculCFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
