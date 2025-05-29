import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VueSdSectionnementComponent } from './vue-sd-sectionnement.component';

describe('VueSdSectionnementComponent', () => {
  let component: VueSdSectionnementComponent;
  let fixture: ComponentFixture<VueSdSectionnementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VueSdSectionnementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VueSdSectionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
