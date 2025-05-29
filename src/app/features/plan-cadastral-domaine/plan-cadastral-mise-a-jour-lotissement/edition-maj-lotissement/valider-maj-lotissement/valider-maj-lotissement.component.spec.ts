import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValiderMocellementComponent } from './valider-mocellement.component';

describe('ValiderMocellementComponent', () => {
  let component: ValiderMocellementComponent;
  let fixture: ComponentFixture<ValiderMocellementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValiderMocellementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValiderMocellementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
