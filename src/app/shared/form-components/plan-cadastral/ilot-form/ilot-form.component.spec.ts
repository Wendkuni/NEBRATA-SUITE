import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlotFormComponent } from './ilot-form.component';

describe('IlotFormComponent', () => {
  let component: IlotFormComponent;
  let fixture: ComponentFixture<IlotFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IlotFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IlotFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
