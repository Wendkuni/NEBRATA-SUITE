import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegreSuccessoralComponent } from './degre-successoral.component';

describe('DegreSuccessoralComponent', () => {
  let component: DegreSuccessoralComponent;
  let fixture: ComponentFixture<DegreSuccessoralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DegreSuccessoralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DegreSuccessoralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
