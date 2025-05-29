import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdSectionAajouterComponent } from './sd-section-aajouter.component';

describe('SdSectionAajouterComponent', () => {
  let component: SdSectionAajouterComponent;
  let fixture: ComponentFixture<SdSectionAajouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SdSectionAajouterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdSectionAajouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
