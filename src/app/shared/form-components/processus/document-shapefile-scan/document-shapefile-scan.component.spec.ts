import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentShapefileScanComponent } from './document-shapefile-scan.component';

describe('DocumentShapefileScanComponent', () => {
  let component: DocumentShapefileScanComponent;
  let fixture: ComponentFixture<DocumentShapefileScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentShapefileScanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentShapefileScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
