import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieParActeurComponent } from './saisie-par-acteur.component';

describe('SaisieParActeurComponent', () => {
  let component: SaisieParActeurComponent;
  let fixture: ComponentFixture<SaisieParActeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaisieParActeurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaisieParActeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
