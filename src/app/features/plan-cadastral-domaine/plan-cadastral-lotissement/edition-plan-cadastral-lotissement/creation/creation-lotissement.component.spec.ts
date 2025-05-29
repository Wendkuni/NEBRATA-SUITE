import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationLotissementComponent } from './creation-lotissement.component';

describe('CreationLotissementComponent', () => {
  let component: CreationLotissementComponent;
  let fixture: ComponentFixture<CreationLotissementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationLotissementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationLotissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
