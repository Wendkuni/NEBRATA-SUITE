import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusJuridiqueComponent } from './status-juridique.component';

describe('StatusJuridiqueComponent', () => {
  let component: StatusJuridiqueComponent;
  let fixture: ComponentFixture<StatusJuridiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusJuridiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusJuridiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
