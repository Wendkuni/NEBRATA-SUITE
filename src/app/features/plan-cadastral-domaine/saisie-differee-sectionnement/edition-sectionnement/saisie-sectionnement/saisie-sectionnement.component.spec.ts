import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieSectionnementComponent } from './saisie-sectionnement.component';

describe('SaisieSectionnementComponent', () => {
  let component: SaisieSectionnementComponent;
  let fixture: ComponentFixture<SaisieSectionnementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaisieSectionnementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaisieSectionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
