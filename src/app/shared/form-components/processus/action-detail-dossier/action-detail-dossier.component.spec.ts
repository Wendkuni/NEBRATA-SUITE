import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDetailDossierComponent } from './action-detail-dossier.component';

describe('ActionDetailDossierComponent', () => {
  let component: ActionDetailDossierComponent;
  let fixture: ComponentFixture<ActionDetailDossierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionDetailDossierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionDetailDossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
