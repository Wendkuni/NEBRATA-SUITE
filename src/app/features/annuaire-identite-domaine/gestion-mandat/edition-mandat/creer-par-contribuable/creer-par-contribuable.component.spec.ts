import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerParContribuableComponent } from './creer-par-contribuable.component';

describe('CreerParContribuableComponent', () => {
  let component: CreerParContribuableComponent;
  let fixture: ComponentFixture<CreerParContribuableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreerParContribuableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreerParContribuableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
