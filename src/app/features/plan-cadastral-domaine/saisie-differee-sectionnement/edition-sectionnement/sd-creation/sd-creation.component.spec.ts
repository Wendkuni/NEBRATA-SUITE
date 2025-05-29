import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdCreationComponent } from './sd-creation.component';

describe('SdCreationComponent', () => {
  let component: SdCreationComponent;
  let fixture: ComponentFixture<SdCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SdCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
