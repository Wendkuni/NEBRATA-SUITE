import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolderCFComponent } from './solder-cf.component';

describe('SolderCFComponent', () => {
  let component: SolderCFComponent;
  let fixture: ComponentFixture<SolderCFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolderCFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolderCFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
