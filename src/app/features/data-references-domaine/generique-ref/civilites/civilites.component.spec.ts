import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CivilitesComponent } from './civilites.component';

describe('CivilitesComponent', () => {
  let component: CivilitesComponent;
  let fixture: ComponentFixture<CivilitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CivilitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CivilitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
