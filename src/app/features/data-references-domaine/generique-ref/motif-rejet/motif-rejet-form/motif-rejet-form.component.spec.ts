import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotifRejetFormComponent } from './motif-rejet-form.component';

describe('MotifRejetFormComponent', () => {
  let component: MotifRejetFormComponent;
  let fixture: ComponentFixture<MotifRejetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotifRejetFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotifRejetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
