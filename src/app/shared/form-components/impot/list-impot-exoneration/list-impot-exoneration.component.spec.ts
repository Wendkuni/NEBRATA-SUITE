import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListImpotExonerationComponent } from './list-impot-exoneration.component';

describe('ListImpotExonerationComponent', () => {
  let component: ListImpotExonerationComponent;
  let fixture: ComponentFixture<ListImpotExonerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListImpotExonerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListImpotExonerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
