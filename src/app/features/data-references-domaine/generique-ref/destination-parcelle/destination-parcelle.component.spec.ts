import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationParcelleComponent } from './destination-parcelle.component';

describe('DestinationParcelleComponent', () => {
  let component: DestinationParcelleComponent;
  let fixture: ComponentFixture<DestinationParcelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinationParcelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationParcelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
