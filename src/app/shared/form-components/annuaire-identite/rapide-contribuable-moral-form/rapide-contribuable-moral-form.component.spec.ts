import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapideContribuableMoralFormComponent } from './rapide-contribuable-moral-form.component';

describe('RapideContribuableMoralFormComponent', () => {
  let component: RapideContribuableMoralFormComponent;
  let fixture: ComponentFixture<RapideContribuableMoralFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RapideContribuableMoralFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RapideContribuableMoralFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
