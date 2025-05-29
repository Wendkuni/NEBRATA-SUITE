import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionExonerationComponent } from './edition-exoneration.component';

describe('EditionExonerationComponent', () => {
  let component: EditionExonerationComponent;
  let fixture: ComponentFixture<EditionExonerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditionExonerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionExonerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
