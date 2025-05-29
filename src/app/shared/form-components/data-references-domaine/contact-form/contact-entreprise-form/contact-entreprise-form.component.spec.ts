import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactEntrepriseFormComponent } from './contact-entreprise-form.component';

describe('ContactEntrepriseFormComponent', () => {
  let component: ContactEntrepriseFormComponent;
  let fixture: ComponentFixture<ContactEntrepriseFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactEntrepriseFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactEntrepriseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
