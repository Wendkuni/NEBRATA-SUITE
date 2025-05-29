import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieLotissementComponent } from './saisie-lotissement.component';

describe('SaisieLotissementComponent', () => {
  let component: SaisieLotissementComponent;
  let fixture: ComponentFixture<SaisieLotissementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaisieLotissementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaisieLotissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
