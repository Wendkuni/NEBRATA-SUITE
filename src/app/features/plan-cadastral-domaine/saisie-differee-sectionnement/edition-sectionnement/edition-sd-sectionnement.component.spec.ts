import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionSdSectionnementComponent } from './edition-sd-sectionnement.component';

describe('EditionSdSectionnementComponent', () => {
  let component: EditionSdSectionnementComponent;
  let fixture: ComponentFixture<EditionSdSectionnementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditionSdSectionnementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditionSdSectionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
