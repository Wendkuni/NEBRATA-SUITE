import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPvFormComponent } from './document-pv-form.component';

describe('DocumentPvFormComponent', () => {
  let component: DocumentPvFormComponent;
  let fixture: ComponentFixture<DocumentPvFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentPvFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentPvFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
