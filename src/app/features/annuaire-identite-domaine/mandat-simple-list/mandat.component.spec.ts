import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatComponent } from './mandat.component';

describe('MandatComponent', () => {
  let component: MandatComponent;
  let fixture: ComponentFixture<MandatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MandatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
