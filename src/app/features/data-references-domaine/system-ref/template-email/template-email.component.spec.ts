import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TemplateEmailComponent } from "./template-email.component";

describe("TemplateEmailComponent", () => {
  let component: TemplateEmailComponent;
  let fixture: ComponentFixture<TemplateEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateEmailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
