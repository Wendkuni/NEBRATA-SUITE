import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FusionnerComponent } from './fusionner.component';

describe('FusionnerComponent', () => {
  let component: FusionnerComponent;
  let fixture: ComponentFixture<FusionnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FusionnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FusionnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
