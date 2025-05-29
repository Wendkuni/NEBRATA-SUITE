import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeTransitionComponent } from './type-transition.component';

describe('CategorieImmeubleComponent', () => {
  let component: TypeTransitionComponent;
  let fixture: ComponentFixture<TypeTransitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeTransitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
