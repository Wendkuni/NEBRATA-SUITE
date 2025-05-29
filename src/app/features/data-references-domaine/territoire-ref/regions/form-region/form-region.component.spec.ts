import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRegionComponent } from './form-region.component';

describe('FormRegionComponent', () => {
  let component: FormRegionComponent;
  let fixture: ComponentFixture<FormRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRegionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
