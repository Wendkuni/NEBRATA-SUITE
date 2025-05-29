import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegimeFiscalComponent } from './regime-fiscal.component';

describe('RegimeFiscalComponent', () => {
  let component: RegimeFiscalComponent;
  let fixture: ComponentFixture<RegimeFiscalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegimeFiscalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegimeFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
