import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormIndivisionRelationComponent} from "@sycadFeature/relation-indivision/form-indivision/form-indivisionRelation.component";





describe('FormIndivisionRelationComponent', () => {
  let component: FormIndivisionRelationComponent;
  let fixture: ComponentFixture<FormIndivisionRelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormIndivisionRelationComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormIndivisionRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
