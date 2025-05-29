import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActeurCardComponent } from './acteur-card.component';

describe('ActeurCardComponent', () => {
  let component: ActeurCardComponent;
  let fixture: ComponentFixture<ActeurCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActeurCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActeurCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
