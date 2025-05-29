import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationFusionnementComponent } from './creation-fusionnement.component';

describe('CreationFusionnementComponent', () => {
  let component: CreationFusionnementComponent;
  let fixture: ComponentFixture<CreationFusionnementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationFusionnementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationFusionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
