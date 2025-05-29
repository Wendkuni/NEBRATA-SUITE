import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarEditionComponent } from './avatar-edition.component';

describe('AvatarEditionComponent', () => {
  let component: AvatarEditionComponent;
  let fixture: ComponentFixture<AvatarEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvatarEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
