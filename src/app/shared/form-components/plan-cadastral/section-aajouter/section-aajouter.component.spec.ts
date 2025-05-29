import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionAAjouterComponent } from './section-aajouter.component';

describe('SectionAAjouterComponent', () => {
  let component: SectionAAjouterComponent;
  let fixture: ComponentFixture<SectionAAjouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionAAjouterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionAAjouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
