import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelVoirPlusComponent } from './model-voir-plus.component';

describe('ModelVoirPlusComponent', () => {
  let component: ModelVoirPlusComponent;
  let fixture: ComponentFixture<ModelVoirPlusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelVoirPlusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelVoirPlusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
