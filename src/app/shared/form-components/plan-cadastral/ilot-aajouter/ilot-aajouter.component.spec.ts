import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlotAAjouterComponent } from './ilot-aajouter.component';

describe('IlotAAjouterComponent', () => {
  let component: IlotAAjouterComponent;
  let fixture: ComponentFixture<IlotAAjouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IlotAAjouterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IlotAAjouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
