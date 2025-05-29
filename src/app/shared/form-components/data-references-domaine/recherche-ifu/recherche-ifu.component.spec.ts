import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheSintaxComponent } from './recherche-ifu.component';

describe('RechercheSintaxComponent', () => {
  let component: RechercheSintaxComponent;
  let fixture: ComponentFixture<RechercheSintaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechercheSintaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechercheSintaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
