import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValiderSdDelivranceAapComponent } from './valider-sd-delivrance-aap.component';

describe('ValiderSdDelivranceAapComponent', () => {
  let component: ValiderSdDelivranceAapComponent;
  let fixture: ComponentFixture<ValiderSdDelivranceAapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValiderSdDelivranceAapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValiderSdDelivranceAapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
