import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQuartierComponent } from './form-quartier.component';

describe('FormQuartierComponent', () => {
  let component: FormQuartierComponent;
  let fixture: ComponentFixture<FormQuartierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormQuartierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQuartierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
