import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPageStructureComponent } from './form-page-structure.component';

describe('FormPageStructureComponent', () => {
  let component: FormPageStructureComponent;
  let fixture: ComponentFixture<FormPageStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPageStructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPageStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
