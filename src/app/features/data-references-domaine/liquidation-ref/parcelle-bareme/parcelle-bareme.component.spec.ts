import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelleBaremeComponent } from './parcelle-bareme.component';

describe('ParcelleBaremeComponent', () => {
  let component: ParcelleBaremeComponent;
  let fixture: ComponentFixture<ParcelleBaremeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcelleBaremeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelleBaremeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
