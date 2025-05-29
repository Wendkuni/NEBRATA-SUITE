import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PCSecValiderLaSaisieComponent } from './valider-la-saisie.component';

describe('ValiderLaSaisieComponent', () => {
  let component: PCSecValiderLaSaisieComponent;
  let fixture: ComponentFixture<PCSecValiderLaSaisieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PCSecValiderLaSaisieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PCSecValiderLaSaisieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
