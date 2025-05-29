import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionsAModifierComponent } from './sections-amodifier.component';

describe('SectionsAModifierComponent', () => {
  let component: SectionsAModifierComponent;
  let fixture: ComponentFixture<SectionsAModifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionsAModifierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionsAModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
