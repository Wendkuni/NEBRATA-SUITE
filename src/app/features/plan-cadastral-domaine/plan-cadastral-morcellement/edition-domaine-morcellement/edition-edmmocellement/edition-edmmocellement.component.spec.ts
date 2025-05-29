import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionEDMMocellementComponent } from './edition-edmmocellement.component';

describe('EditionEDMMocellementComponent', () => {
  let component: EditionEDMMocellementComponent;
  let fixture: ComponentFixture<EditionEDMMocellementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditionEDMMocellementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionEDMMocellementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
