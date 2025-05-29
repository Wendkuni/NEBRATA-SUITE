import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorcelerComponent } from './morceler.component';

describe('MorcelerComponent', () => {
  let component: MorcelerComponent;
  let fixture: ComponentFixture<MorcelerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MorcelerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MorcelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
