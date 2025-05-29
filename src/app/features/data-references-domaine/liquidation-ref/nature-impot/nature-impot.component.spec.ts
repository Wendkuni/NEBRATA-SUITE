import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureImpotComponent } from './nature-impot.component';

describe('NatureImpotComponent', () => {
  let component: NatureImpotComponent;
  let fixture: ComponentFixture<NatureImpotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NatureImpotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NatureImpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
