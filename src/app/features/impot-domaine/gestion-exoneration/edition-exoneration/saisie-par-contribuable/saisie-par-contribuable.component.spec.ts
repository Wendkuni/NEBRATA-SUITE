import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieParContribuableComponent } from './saisie-par-contribuable.component';

describe('SaisieParContribuableComponent', () => {
  let component: SaisieParContribuableComponent;
  let fixture: ComponentFixture<SaisieParContribuableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaisieParContribuableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaisieParContribuableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
