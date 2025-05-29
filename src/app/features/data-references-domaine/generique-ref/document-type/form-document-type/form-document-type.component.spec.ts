import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDocumentTypeComponent } from './form-document-type.component';

describe('FormDocumentTypeComponent', () => {
  let component: FormDocumentTypeComponent;
  let fixture: ComponentFixture<FormDocumentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDocumentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDocumentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
