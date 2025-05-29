import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdSectionAdesactiveComponent } from './sd-section-adesactive.component';

describe('SdSectionAdesactiveComponent', () => {
  let component: SdSectionAdesactiveComponent;
  let fixture: ComponentFixture<SdSectionAdesactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SdSectionAdesactiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdSectionAdesactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
