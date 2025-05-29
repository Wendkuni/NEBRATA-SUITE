import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserContibuablePhysiqueComponent } from './info-user-contibuable-physique.component';

describe('InfoUserContibuablePhysiqueComponent', () => {
  let component: InfoUserContibuablePhysiqueComponent;
  let fixture: ComponentFixture<InfoUserContibuablePhysiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserContibuablePhysiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserContibuablePhysiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
