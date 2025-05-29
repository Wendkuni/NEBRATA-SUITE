import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoieVersSintaxComponent } from './envoie-vers-sintax.component';

describe('EnvoieVersSintaxComponent', () => {
  let component: EnvoieVersSintaxComponent;
  let fixture: ComponentFixture<EnvoieVersSintaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvoieVersSintaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvoieVersSintaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
