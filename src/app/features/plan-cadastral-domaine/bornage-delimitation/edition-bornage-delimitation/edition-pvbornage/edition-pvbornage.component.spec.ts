import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionPVBornageComponent } from './edition-pvbornage.component';

describe('EditionPVBornageComponent', () => {
  let component: EditionPVBornageComponent;
  let fixture: ComponentFixture<EditionPVBornageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditionPVBornageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionPVBornageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
