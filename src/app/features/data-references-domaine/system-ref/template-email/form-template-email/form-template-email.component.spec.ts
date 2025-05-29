import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormTemplateEmailComponent } from "./form-template-email.component";

describe("FormTemplateEmailComponent", () => {
  let component: FormTemplateEmailComponent;
  let fixture: ComponentFixture<FormTemplateEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormTemplateEmailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTemplateEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
