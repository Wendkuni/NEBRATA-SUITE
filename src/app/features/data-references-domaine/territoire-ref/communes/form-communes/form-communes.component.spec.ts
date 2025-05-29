import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCommuneComponent } from './form-communes.component';



describe('FormCommuneComponent', () => {
  let component: FormCommuneComponent;
  let fixture: ComponentFixture<FormCommuneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCommuneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCommuneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
