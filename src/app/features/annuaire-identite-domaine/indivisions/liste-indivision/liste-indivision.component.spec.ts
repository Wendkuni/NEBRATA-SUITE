import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeIndivisionComponent } from './liste-indivision.component';

describe('ListeIndivisionComponent', () => {
  let component: ListeIndivisionComponent;
  let fixture: ComponentFixture<ListeIndivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeIndivisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeIndivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
