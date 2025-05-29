import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListActeursComponent } from './list-acteurs.component';

describe('ListActeursComponent', () => {
  let component: ListActeursComponent;
  let fixture: ComponentFixture<ListActeursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListActeursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListActeursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
