import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionCreationUserComponent } from './edition-creation-user.component';

describe('EditionCreationUserComponent', () => {
  let component: EditionCreationUserComponent;
  let fixture: ComponentFixture<EditionCreationUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditionCreationUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionCreationUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
