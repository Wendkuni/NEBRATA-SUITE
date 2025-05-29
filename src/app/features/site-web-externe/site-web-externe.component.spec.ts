import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteWebExterneComponent } from './site-web-externe.component';

describe('SiteWebExterneComponent', () => {
  let component: SiteWebExterneComponent;
  let fixture: ComponentFixture<SiteWebExterneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteWebExterneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteWebExterneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
