import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormLivreFoncierComponent } from './form-livre-foncier.component';


describe('FormCategoriePieceIdentiteComponent', () => {
  let component: FormLivreFoncierComponent;
  let fixture: ComponentFixture<FormLivreFoncierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormLivreFoncierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLivreFoncierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
