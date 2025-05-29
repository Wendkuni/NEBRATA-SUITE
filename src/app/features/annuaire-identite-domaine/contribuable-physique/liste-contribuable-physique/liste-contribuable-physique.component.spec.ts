import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeContribuablePhysiqueComponent } from './liste-contribuable-physique.component';

describe('ListeContribuablePhysiqueComponent', () => {
  let component: ListeContribuablePhysiqueComponent;
  let fixture: ComponentFixture<ListeContribuablePhysiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeContribuablePhysiqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeContribuablePhysiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
