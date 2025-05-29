import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejetSaisieLotissementComponent } from './rejet-saisie-lotissement.component';

describe('RejetSaisieLotissementComponent', () => {
  let component: RejetSaisieLotissementComponent;
  let fixture: ComponentFixture<RejetSaisieLotissementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejetSaisieLotissementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejetSaisieLotissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
