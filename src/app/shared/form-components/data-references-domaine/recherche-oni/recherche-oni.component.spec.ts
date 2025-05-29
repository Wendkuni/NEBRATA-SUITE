import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheOniComponent } from './recherche-oni.component';

describe('RechercheOniComponent', () => {
  let component: RechercheOniComponent;
  let fixture: ComponentFixture<RechercheOniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechercheOniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechercheOniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
