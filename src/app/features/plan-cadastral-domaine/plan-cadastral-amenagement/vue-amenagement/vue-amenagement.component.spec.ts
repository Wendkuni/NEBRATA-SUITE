import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VueLotissementComponent } from './vue-lotissement.component';

describe('VueLotissementComponent', () => {
  let component: VueLotissementComponent;
  let fixture: ComponentFixture<VueLotissementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VueLotissementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VueLotissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
