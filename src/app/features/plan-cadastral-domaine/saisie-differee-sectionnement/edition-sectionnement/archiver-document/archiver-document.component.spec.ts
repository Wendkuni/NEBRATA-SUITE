import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiverDocumentComponent } from './archiver-document.component';

describe('ArchiverDocumentComponent', () => {
  let component: ArchiverDocumentComponent;
  let fixture: ComponentFixture<ArchiverDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiverDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiverDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
