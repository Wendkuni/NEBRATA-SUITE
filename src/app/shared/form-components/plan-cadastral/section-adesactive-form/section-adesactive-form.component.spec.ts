import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionADesactiveFormComponent } from './section-adesactive-form.component';

describe('SectionADesactiveFormComponent', () => {
  let component: SectionADesactiveFormComponent;
  let fixture: ComponentFixture<SectionADesactiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionADesactiveFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionADesactiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
