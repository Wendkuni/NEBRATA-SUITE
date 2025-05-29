import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapideContribuablePhysiqueFormComponent } from './rapide-contribuable-physique-form.component';

describe('RapideContribuablePhysiqueFormComponent', () => {
  let component: RapideContribuablePhysiqueFormComponent;
  let fixture: ComponentFixture<RapideContribuablePhysiqueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RapideContribuablePhysiqueFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RapideContribuablePhysiqueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
