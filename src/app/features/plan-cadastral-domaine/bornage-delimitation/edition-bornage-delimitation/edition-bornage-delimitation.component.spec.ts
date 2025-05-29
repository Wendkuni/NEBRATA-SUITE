import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionBornageDelimitationComponent } from './edition-bornage-delimitation.component';

describe('EditionBornageDelimitationComponent', () => {
  let component: EditionBornageDelimitationComponent;
  let fixture: ComponentFixture<EditionBornageDelimitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditionBornageDelimitationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionBornageDelimitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
