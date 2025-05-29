import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieFusionnementComponent } from './saisie-fusionnement.component';

describe('SaisieFusionnementComponent', () => {
  let component: SaisieFusionnementComponent;
  let fixture: ComponentFixture<SaisieFusionnementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaisieFusionnementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaisieFusionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
