import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormContribuablePhysiqueComponent } from './form-contribuable-physique.component';

describe('FormContribuablePhysiqueComponent', () => {
  let component: FormContribuablePhysiqueComponent;
  let fixture: ComponentFixture<FormContribuablePhysiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormContribuablePhysiqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormContribuablePhysiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
