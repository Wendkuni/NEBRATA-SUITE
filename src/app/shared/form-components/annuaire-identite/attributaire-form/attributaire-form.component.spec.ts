import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributaireFormComponent } from './attributaire-form.component';

describe('AttributaireFormComponent', () => {
  let component: AttributaireFormComponent;
  let fixture: ComponentFixture<AttributaireFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttributaireFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributaireFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
