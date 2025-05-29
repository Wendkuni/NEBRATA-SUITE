import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprouverControleBornageComponent } from './approuver-controle-bornage.component';

describe('ApprouverControleBornageComponent', () => {
  let component: ApprouverControleBornageComponent;
  let fixture: ComponentFixture<ApprouverControleBornageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprouverControleBornageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprouverControleBornageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
