import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenvoyerVersContribuableComponent } from './renvoyer-vers-contribuable.component';

describe('RenvoyerVersContribuableComponent', () => {
  let component: RenvoyerVersContribuableComponent;
  let fixture: ComponentFixture<RenvoyerVersContribuableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenvoyerVersContribuableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenvoyerVersContribuableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
