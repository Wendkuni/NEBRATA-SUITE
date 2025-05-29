import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValiderMandatComponent } from './valider-mandat.component';

describe('ValiderMandatComponent', () => {
  let component: ValiderMandatComponent;
  let fixture: ComponentFixture<ValiderMandatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValiderMandatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValiderMandatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
