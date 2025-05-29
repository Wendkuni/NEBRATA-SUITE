import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreFoncierComponent } from './livre-foncier.component';

describe('LivreFoncierComponent', () => {
  let component: LivreFoncierComponent;
  let fixture: ComponentFixture<LivreFoncierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivreFoncierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivreFoncierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
