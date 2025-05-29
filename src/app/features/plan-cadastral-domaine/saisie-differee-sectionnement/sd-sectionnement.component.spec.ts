import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdSectionnementComponent } from './sd-sectionnement.component';

describe('SdSectionnementComponent', () => {
  let component: SdSectionnementComponent;
  let fixture: ComponentFixture<SdSectionnementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SdSectionnementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdSectionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
