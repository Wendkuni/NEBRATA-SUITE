import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormConfigProcessusComponent } from './form-config-processus.component';

describe('FormConfigFusionnementComponent', () => {
  let component: FormConfigProcessusComponent;
  let fixture: ComponentFixture<FormConfigProcessusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormConfigProcessusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormConfigProcessusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
