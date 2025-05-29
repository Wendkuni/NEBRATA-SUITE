import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdSectionAmodifierFormComponent } from './sd-section-amodifier-form.component';

describe('SdSectionAmodifierFormComponent', () => {
  let component: SdSectionAmodifierFormComponent;
  let fixture: ComponentFixture<SdSectionAmodifierFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SdSectionAmodifierFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdSectionAmodifierFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
