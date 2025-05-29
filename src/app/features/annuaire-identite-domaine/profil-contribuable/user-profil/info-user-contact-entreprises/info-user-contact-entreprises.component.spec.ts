import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserContactEntreprisesComponent } from './info-user-contact-entreprises.component';

describe('InfoUserContactEntreprisesComponent', () => {
  let component: InfoUserContactEntreprisesComponent;
  let fixture: ComponentFixture<InfoUserContactEntreprisesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserContactEntreprisesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserContactEntreprisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
