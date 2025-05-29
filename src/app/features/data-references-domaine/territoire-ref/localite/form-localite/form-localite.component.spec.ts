import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormLocaliteComponent } from './form-localite.component';
 



describe('FormLocaliteComponent', () => {
  let component: FormLocaliteComponent;
  let fixture: ComponentFixture<FormLocaliteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormLocaliteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLocaliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
