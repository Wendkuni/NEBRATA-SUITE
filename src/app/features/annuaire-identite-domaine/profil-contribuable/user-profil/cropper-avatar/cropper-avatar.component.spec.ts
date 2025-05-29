import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropperAvatarComponent } from './cropper-avatar.component';

describe('CropperAvatarComponent', () => {
  let component: CropperAvatarComponent;
  let fixture: ComponentFixture<CropperAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropperAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropperAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
