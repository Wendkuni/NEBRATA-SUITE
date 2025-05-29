import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionEDMFusionComponent} from './edition-edmfusion.component';

describe('EditionEDMFusionComponent', () => {
  let component: EditionEDMFusionComponent;
  let fixture: ComponentFixture<EditionEDMFusionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditionEDMFusionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionEDMFusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
