import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExonerationFormComponent } from './exoneration-form.component';

describe('ExonerationFormComponent', () => {
  let component: ExonerationFormComponent;
  let fixture: ComponentFixture<ExonerationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExonerationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExonerationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
