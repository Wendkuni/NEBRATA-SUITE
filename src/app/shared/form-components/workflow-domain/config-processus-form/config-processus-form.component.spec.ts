import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigProcessusFormComponent } from './config-processus-form.component';

describe('ConfigProcessusFormComponent', () => {
  let component: ConfigProcessusFormComponent;
  let fixture: ComponentFixture<ConfigProcessusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigProcessusFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigProcessusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
