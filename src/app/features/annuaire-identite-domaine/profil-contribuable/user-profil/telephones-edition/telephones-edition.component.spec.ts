import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelephonesEditionComponent } from './telephones-edition.component';

describe('TelephonesEditionComponent', () => {
  let component: TelephonesEditionComponent;
  let fixture: ComponentFixture<TelephonesEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelephonesEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelephonesEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
