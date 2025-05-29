import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValiderExonerationComponent } from './valider-exoneration.component';

describe('ValiderExonerationComponent', () => {
  let component: ValiderExonerationComponent;
  let fixture: ComponentFixture<ValiderExonerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValiderExonerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValiderExonerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
