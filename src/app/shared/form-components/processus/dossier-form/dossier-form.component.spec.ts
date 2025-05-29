import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierFormComponent } from './dossier-form.component';

describe('DossierFormComponent', () => {
  let component: DossierFormComponent;
  let fixture: ComponentFixture<DossierFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DossierFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
