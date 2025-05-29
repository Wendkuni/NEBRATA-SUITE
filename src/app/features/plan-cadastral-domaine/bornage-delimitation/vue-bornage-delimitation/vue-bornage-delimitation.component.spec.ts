import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VueBornageDelimitationComponent } from './vue-bornage-delimitation.component';

describe('VueBornageDelimitationComponent', () => {
  let component: VueBornageDelimitationComponent;
  let fixture: ComponentFixture<VueBornageDelimitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VueBornageDelimitationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VueBornageDelimitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
