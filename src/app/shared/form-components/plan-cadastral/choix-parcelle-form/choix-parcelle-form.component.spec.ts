import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoixParcelleFormComponent } from './choix-parcelle-form.component';

describe('ChoixParcelleFormComponent', () => {
  let component: ChoixParcelleFormComponent;
  let fixture: ComponentFixture<ChoixParcelleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoixParcelleFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoixParcelleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
