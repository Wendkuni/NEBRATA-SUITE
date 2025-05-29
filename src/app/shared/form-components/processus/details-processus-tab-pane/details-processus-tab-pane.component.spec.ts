import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsProcessusTabPaneComponent } from './details-processus-tab-pane.component';

describe('DetailsProcessusTabPaneComponent', () => {
  let component: DetailsProcessusTabPaneComponent;
  let fixture: ComponentFixture<DetailsProcessusTabPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsProcessusTabPaneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsProcessusTabPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
