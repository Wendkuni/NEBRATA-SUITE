import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReseauSociauxFormComponent } from './reseau-sociaux-form.component';

describe('ReseauSociauxFormComponent', () => {
  let component: ReseauSociauxFormComponent;
  let fixture: ComponentFixture<ReseauSociauxFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReseauSociauxFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReseauSociauxFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
