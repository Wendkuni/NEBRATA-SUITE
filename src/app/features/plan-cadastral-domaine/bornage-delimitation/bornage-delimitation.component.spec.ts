import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BornageDelimitationComponent } from './bornage-delimitation.component';

describe('BornageDelimitationComponent', () => {
  let component: BornageDelimitationComponent;
  let fixture: ComponentFixture<BornageDelimitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BornageDelimitationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BornageDelimitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
