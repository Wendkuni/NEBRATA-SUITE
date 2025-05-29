import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NationaliteComponent } from './nationalite.component';

describe('NationaliteComponent', () => {
  let component: NationaliteComponent;
  let fixture: ComponentFixture<NationaliteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NationaliteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NationaliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
