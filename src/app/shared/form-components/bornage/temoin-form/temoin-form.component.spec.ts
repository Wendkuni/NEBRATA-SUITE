import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemoinFormComponent } from './temoin-form.component';

describe('TemoinFormComponent', () => {
  let component: TemoinFormComponent;
  let fixture: ComponentFixture<TemoinFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemoinFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemoinFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
