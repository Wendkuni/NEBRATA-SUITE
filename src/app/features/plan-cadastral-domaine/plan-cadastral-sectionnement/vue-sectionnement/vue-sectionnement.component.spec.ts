import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VueSectionnementComponent } from './vue-sectionnement.component';

describe('VueSectionnementComponent', () => {
  let component: VueSectionnementComponent;
  let fixture: ComponentFixture<VueSectionnementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VueSectionnementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VueSectionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
