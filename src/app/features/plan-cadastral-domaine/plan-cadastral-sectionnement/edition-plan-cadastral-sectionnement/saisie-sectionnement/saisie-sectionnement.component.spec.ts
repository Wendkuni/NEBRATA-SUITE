import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PCSecSaisieSectionnementComponent } from './saisie-sectionnement.component';

describe('SaisieSectionnementComponent', () => {
  let component: PCSecSaisieSectionnementComponent;
  let fixture: ComponentFixture<PCSecSaisieSectionnementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PCSecSaisieSectionnementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PCSecSaisieSectionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
