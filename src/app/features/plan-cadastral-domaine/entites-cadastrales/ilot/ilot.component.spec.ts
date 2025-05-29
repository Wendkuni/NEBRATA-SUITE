import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlotComponent } from './ilot.component';

describe('IlotComponent', () => {
  let component: IlotComponent;
  let fixture: ComponentFixture<IlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
