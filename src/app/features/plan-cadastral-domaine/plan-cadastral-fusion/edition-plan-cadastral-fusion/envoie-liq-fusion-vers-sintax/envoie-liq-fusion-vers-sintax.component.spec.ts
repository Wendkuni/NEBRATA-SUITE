import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoieLiqFusionVersSintaxComponent } from './envoie-liq-fusion-vers-sintax.component';

describe('EnvoieLiqFusionVersSintaxComponent', () => {
  let component: EnvoieLiqFusionVersSintaxComponent;
  let fixture: ComponentFixture<EnvoieLiqFusionVersSintaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvoieLiqFusionVersSintaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvoieLiqFusionVersSintaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
