import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationParContribuableComponent } from './creation-par-contribuable.component';

describe('CreationParContribuableComponent', () => {
  let component: CreationParContribuableComponent;
  let fixture: ComponentFixture<CreationParContribuableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationParContribuableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationParContribuableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
