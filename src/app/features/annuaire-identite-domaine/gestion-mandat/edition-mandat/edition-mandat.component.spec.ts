import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionMandatComponent } from './edition-mandat.component';

describe('EditionMandatComponent', () => {
  let component: EditionMandatComponent;
  let fixture: ComponentFixture<EditionMandatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditionMandatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionMandatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
