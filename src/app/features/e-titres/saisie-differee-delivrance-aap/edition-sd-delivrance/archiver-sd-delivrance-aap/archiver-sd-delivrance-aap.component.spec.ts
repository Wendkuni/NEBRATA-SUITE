import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiverSdDelivranceAapComponent } from './archiver-sd-delivrance-aap.component';

describe('ArchiverSdDelivranceAapComponent', () => {
  let component: ArchiverSdDelivranceAapComponent;
  let fixture: ComponentFixture<ArchiverSdDelivranceAapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchiverSdDelivranceAapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiverSdDelivranceAapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
