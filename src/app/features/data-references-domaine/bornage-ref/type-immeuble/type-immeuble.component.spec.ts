import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeImmeubleComponent } from './type-immeuble.component';

describe('TypeImmeubleComponent', () => {
  let component: TypeImmeubleComponent;
  let fixture: ComponentFixture<TypeImmeubleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeImmeubleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeImmeubleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
