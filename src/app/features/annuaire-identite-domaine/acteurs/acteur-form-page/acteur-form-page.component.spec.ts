import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActeurFormPageComponent } from './acteur-form-page.component';

describe('ActeurFormPageComponent', () => {
  let component: ActeurFormPageComponent;
  let fixture: ComponentFixture<ActeurFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActeurFormPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActeurFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
