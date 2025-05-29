import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapideContribuableFormComponent } from './rapide-contribuable-form.component';

describe('RapideContribuableFormComponent', () => {
  let component: RapideContribuableFormComponent;
  let fixture: ComponentFixture<RapideContribuableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RapideContribuableFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RapideContribuableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
