import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserDemandeDocumentComponent } from './info-user-demande-document.component';

describe('InfoUserDemandeDocumentComponent', () => {
  let component: InfoUserDemandeDocumentComponent;
  let fixture: ComponentFixture<InfoUserDemandeDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoUserDemandeDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUserDemandeDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
