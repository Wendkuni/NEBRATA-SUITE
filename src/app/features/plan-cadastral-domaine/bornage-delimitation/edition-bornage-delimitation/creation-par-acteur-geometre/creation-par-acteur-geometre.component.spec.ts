import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationParActeurGeometreComponent } from './creation-par-acteur-geometre.component';

describe('CreationParActeurGeometreComponent', () => {
  let component: CreationParActeurGeometreComponent;
  let fixture: ComponentFixture<CreationParActeurGeometreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationParActeurGeometreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationParActeurGeometreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
