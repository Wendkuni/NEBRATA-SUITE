import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PCSecRejeterLaSaisieComponent } from './rejeter-la-saisie.component';

describe('RejeterLaSaisieComponent', () => {
  let component: PCSecRejeterLaSaisieComponent;
  let fixture: ComponentFixture<PCSecRejeterLaSaisieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PCSecRejeterLaSaisieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PCSecRejeterLaSaisieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
