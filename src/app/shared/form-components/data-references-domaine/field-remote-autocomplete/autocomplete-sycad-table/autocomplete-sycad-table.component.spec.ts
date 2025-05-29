import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteSycadTableComponent } from './autocomplete-sycad-table.component';

describe('AutocompleteSycadTableComponent', () => {
  let component: AutocompleteSycadTableComponent;
  let fixture: ComponentFixture<AutocompleteSycadTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutocompleteSycadTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteSycadTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
