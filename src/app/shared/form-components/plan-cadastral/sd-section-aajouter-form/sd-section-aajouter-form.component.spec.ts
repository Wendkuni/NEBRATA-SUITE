import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdSectionAajouterFormComponent } from './sd-section-aajouter-form.component';

describe('SdSectionAajouterFormComponent', () => {
  let component: SdSectionAajouterFormComponent;
  let fixture: ComponentFixture<SdSectionAajouterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SdSectionAajouterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdSectionAajouterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
