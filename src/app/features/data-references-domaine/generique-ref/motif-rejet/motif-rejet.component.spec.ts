import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotifRejetComponent } from './motif-rejet.component';

describe('MotifRejetComponent', () => {
  let component: MotifRejetComponent;
  let fixture: ComponentFixture<MotifRejetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotifRejetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotifRejetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
