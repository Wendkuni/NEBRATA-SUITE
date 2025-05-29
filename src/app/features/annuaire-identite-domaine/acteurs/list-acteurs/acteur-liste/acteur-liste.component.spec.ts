import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActeurListeComponent } from './acteur-liste.component';

describe('ActeurListeComponent', () => {
  let component: ActeurListeComponent;
  let fixture: ComponentFixture<ActeurListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActeurListeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActeurListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
