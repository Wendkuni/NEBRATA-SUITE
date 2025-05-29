import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionIndexationComponent } from './gestion-indexation.component';

describe('GestionIndexationComponent', () => {
  let component: GestionIndexationComponent;
  let fixture: ComponentFixture<GestionIndexationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionIndexationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionIndexationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
