import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpotFormComponent } from './impot-form.component';

describe('ImpotFormComponent', () => {
  let component: ImpotFormComponent;
  let fixture: ComponentFixture<ImpotFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpotFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpotFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
