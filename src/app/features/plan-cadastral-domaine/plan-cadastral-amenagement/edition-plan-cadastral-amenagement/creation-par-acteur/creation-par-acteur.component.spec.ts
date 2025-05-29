import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationParActeurComponent } from './creation-par-acteur.component';

describe('CreationParActeurComponent', () => {
  let component: CreationParActeurComponent;
  let fixture: ComponentFixture<CreationParActeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationParActeurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationParActeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
