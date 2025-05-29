import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageImpotComponent } from './package-impot.component';

describe('PackageImpotComponent', () => {
  let component: PackageImpotComponent;
  let fixture: ComponentFixture<PackageImpotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageImpotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageImpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
