import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceOfficielleFormComponent } from './piece-officielle-form.component';

describe('PieceOfficielleFormComponent', () => {
  let component: PieceOfficielleFormComponent;
  let fixture: ComponentFixture<PieceOfficielleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieceOfficielleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieceOfficielleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
