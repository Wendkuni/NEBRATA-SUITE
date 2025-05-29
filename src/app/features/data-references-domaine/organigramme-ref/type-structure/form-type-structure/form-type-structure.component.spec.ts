import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTypeStructureComponent } from './form-type-structure.component';

describe('FormTypeStructureComponent', () => {
  let component: FormTypeStructureComponent;
  let fixture: ComponentFixture<FormTypeStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTypeStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTypeStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
