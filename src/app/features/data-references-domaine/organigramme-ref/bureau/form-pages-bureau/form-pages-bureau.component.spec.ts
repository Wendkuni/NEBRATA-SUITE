import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPagesBureauComponent } from './form-pages-bureau.component';

describe('FormPagesBureauComponent', () => {
  let component: FormPagesBureauComponent;
  let fixture: ComponentFixture<FormPagesBureauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPagesBureauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPagesBureauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
