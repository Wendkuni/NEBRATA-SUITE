import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoieLiqBornageVersSintaxComponent } from './envoie-liq-bornage-vers-sintax.component';

describe('EnvoieLiqBornageVersSintaxComponent', () => {
  let component: EnvoieLiqBornageVersSintaxComponent;
  let fixture: ComponentFixture<EnvoieLiqBornageVersSintaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvoieLiqBornageVersSintaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvoieLiqBornageVersSintaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
