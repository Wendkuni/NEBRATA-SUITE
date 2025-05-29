import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VueMandatComponent } from './vue-mandat.component';

describe('VueMandatComponent', () => {
  let component: VueMandatComponent;
  let fixture: ComponentFixture<VueMandatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VueMandatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VueMandatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
