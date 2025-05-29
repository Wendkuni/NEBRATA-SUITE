import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonneContactFormComponent } from './personne-contact-form.component';

describe('PersonneContactFormComponent', () => {
  let component: PersonneContactFormComponent;
  let fixture: ComponentFixture<PersonneContactFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonneContactFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonneContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
