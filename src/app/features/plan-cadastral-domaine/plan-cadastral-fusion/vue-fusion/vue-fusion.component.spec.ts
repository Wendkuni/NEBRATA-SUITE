import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VueFusionnementComponent } from './vue-fusionnement.component';

describe('VueFusionnementComponent', () => {
  let component: VueFusionnementComponent;
  let fixture: ComponentFixture<VueFusionnementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VueFusionnementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VueFusionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
