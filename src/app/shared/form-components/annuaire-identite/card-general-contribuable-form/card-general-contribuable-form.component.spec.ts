import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGeneralContribuableFormComponent } from './card-general-contribuable-form.component';

describe('CardGeneralContribuableFormComponent', () => {
  let component: CardGeneralContribuableFormComponent;
  let fixture: ComponentFixture<CardGeneralContribuableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardGeneralContribuableFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardGeneralContribuableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
