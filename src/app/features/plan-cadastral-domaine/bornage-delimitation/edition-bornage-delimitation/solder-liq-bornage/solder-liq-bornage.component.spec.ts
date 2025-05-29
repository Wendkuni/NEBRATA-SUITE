import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolderLiqBornageComponent } from './solder-liq-bornage.component';

describe('SolderLiqBornageComponent', () => {
  let component: SolderLiqBornageComponent;
  let fixture: ComponentFixture<SolderLiqBornageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolderLiqBornageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolderLiqBornageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
