import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CessionSourceComponent } from './cession-source.component';

describe('CessionSourceComponent', () => {
  let component: CessionSourceComponent;
  let fixture: ComponentFixture<CessionSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CessionSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CessionSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
