import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationIndivisionComponent } from './relation-indivision.component';

describe('RelationIndivisionComponent', () => {
  let component: RelationIndivisionComponent;
  let fixture: ComponentFixture<RelationIndivisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationIndivisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationIndivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
