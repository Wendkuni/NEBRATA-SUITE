import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDomaineFonctionnelComponent } from './form-domaine-fonctionnel.component';

describe('FormCaregorieImmeubleComponent', () => {
  let component: FormDomaineFonctionnelComponent;
  let fixture: ComponentFixture<FormDomaineFonctionnelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDomaineFonctionnelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDomaineFonctionnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
