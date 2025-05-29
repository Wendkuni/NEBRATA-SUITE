import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExonerationCategorieComponent } from './exoneration-categorie.component';

describe('ExonerationCategorieComponent', () => {
  let component: ExonerationCategorieComponent;
  let fixture: ComponentFixture<ExonerationCategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExonerationCategorieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExonerationCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
