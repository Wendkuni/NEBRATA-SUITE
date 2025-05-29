import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExonerationComponent } from './exoneration.component';

describe('ExonerationComponent', () => {
  let component: ExonerationComponent;
  let fixture: ComponentFixture<ExonerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExonerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExonerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
