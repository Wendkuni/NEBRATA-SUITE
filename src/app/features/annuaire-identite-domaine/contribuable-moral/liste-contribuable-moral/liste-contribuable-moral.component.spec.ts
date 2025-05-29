import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeContribuableMoralComponent } from './liste-contribuable-moral.component';

describe('ListeContribuableMoralComponent', () => {
  let component: ListeContribuableMoralComponent;
  let fixture: ComponentFixture<ListeContribuableMoralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeContribuableMoralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeContribuableMoralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
