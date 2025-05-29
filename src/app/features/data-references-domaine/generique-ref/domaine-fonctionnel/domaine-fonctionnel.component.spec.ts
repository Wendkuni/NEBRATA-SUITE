import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomaineFonctionnelComponent } from './domaine-fonctionnel.component';

describe('CategorieImmeubleComponent', () => {
  let component: DomaineFonctionnelComponent;
  let fixture: ComponentFixture<DomaineFonctionnelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomaineFonctionnelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomaineFonctionnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
