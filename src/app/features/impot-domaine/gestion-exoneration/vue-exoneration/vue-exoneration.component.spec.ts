import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VueExonerationComponent } from './vue-exoneration.component';

describe('VueExonerationComponent', () => {
  let component: VueExonerationComponent;
  let fixture: ComponentFixture<VueExonerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VueExonerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VueExonerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
