import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserMutationsComponent } from './info-user-mutations.component';

describe('InfoUserMutationsComponent', () => {
  let component: InfoUserMutationsComponent;
  let fixture: ComponentFixture<InfoUserMutationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserMutationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserMutationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
