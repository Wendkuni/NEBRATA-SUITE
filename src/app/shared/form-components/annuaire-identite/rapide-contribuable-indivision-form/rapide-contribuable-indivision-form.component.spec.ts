import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapideContribuableIndivisionFormComponent } from './rapide-contribuable-indivision-form.component';

describe('RapideContribuableIndivisionFormComponent', () => {
  let component: RapideContribuableIndivisionFormComponent;
  let fixture: ComponentFixture<RapideContribuableIndivisionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RapideContribuableIndivisionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RapideContribuableIndivisionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
