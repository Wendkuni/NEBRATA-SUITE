import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SycadTableComponent } from './sycad-table.component';

describe('SycadTableComponent', () => {
  let component: SycadTableComponent;
  let fixture: ComponentFixture<SycadTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SycadTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SycadTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
