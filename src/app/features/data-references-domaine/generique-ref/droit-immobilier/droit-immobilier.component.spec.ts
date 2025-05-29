import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroitImmobilierComponent } from './droit-immobilier.component';

describe('CategorieImmeubleComponent', () => {
  let component: DroitImmobilierComponent;
  let fixture: ComponentFixture<DroitImmobilierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroitImmobilierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroitImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
