import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmissionCreateurComponent } from './transmission-createur.component';

describe('TransmissionCreateurComponent', () => {
  let component: TransmissionCreateurComponent;
  let fixture: ComponentFixture<TransmissionCreateurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransmissionCreateurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmissionCreateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
