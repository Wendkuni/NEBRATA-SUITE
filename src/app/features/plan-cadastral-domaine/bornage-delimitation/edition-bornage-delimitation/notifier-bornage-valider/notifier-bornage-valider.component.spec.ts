import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifierBornageValiderComponent } from './notifier-bornage-valider.component';

describe('NotifierBornageValiderComponent', () => {
  let component: NotifierBornageValiderComponent;
  let fixture: ComponentFixture<NotifierBornageValiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifierBornageValiderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifierBornageValiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
