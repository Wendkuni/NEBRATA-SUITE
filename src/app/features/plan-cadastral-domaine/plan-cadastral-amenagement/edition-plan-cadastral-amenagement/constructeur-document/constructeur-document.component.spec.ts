import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructeurDocumentComponent } from './constructeur-document.component';

describe('ConstructeurDocumentComponent', () => {
  let component: ConstructeurDocumentComponent;
  let fixture: ComponentFixture<ConstructeurDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructeurDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructeurDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
