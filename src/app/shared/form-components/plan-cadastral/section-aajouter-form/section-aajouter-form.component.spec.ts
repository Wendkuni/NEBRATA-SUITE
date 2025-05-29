import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionAAjouterFormComponent } from './section-aajouter-form.component';

describe('SectionAAjouterFormComponent', () => {
  let component: SectionAAjouterFormComponent;
  let fixture: ComponentFixture<SectionAAjouterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionAAjouterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionAAjouterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
