import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdSectionrecupAajouterComponent } from './sd-sectionrecup-aajouter.component';

describe('SdSectionrecupAajouterComponent', () => {
  let component: SdSectionrecupAajouterComponent;
  let fixture: ComponentFixture<SdSectionrecupAajouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SdSectionrecupAajouterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdSectionrecupAajouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
