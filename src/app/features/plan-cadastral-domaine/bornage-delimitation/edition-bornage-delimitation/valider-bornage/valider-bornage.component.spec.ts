import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValiderBornageComponent } from './valider-bornage.component';

describe('ValiderBornageComponent', () => {
  let component: ValiderBornageComponent;
  let fixture: ComponentFixture<ValiderBornageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValiderBornageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValiderBornageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
