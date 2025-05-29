import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmeubleFormComponent } from './immeuble-form.component';

describe('ImmeubleFormComponent', () => {
  let component: ImmeubleFormComponent;
  let fixture: ComponentFixture<ImmeubleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImmeubleFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImmeubleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
