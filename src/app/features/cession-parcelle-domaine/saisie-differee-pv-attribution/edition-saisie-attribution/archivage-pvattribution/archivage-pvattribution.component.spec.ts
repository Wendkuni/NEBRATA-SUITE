import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivagePVAttributionComponent } from './archivage-pvattribution.component';

describe('ArchivagePVAttributionComponent', () => {
  let component: ArchivagePVAttributionComponent;
  let fixture: ComponentFixture<ArchivagePVAttributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivagePVAttributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivagePVAttributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
