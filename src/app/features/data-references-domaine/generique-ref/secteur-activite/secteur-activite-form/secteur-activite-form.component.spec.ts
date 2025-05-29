import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecteurActiviteFormComponent } from './secteur-activite-form.component';

describe('SecteurActiviteFormComponent', () => {
  let component: SecteurActiviteFormComponent;
  let fixture: ComponentFixture<SecteurActiviteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecteurActiviteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecteurActiviteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
