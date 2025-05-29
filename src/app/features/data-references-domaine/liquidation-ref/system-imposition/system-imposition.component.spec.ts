import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemImpositionComponent } from './system-imposition.component';

describe('SystemImpositionComponent', () => {
  let component: SystemImpositionComponent;
  let fixture: ComponentFixture<SystemImpositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemImpositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemImpositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
