import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelephoneFormComponent } from './telephone-form.component';

describe('TelephoneFormComponent', () => {
  let component: TelephoneFormComponent;
  let fixture: ComponentFixture<TelephoneFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelephoneFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelephoneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
