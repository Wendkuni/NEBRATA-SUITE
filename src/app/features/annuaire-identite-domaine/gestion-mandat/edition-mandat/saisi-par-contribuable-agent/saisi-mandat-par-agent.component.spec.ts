import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaisiMandatParAgentComponent } from './saisi-mandat-par-agent.component';



describe('CreerParContribuableComponent', () => {
  let component: SaisiMandatParAgentComponent;
  let fixture: ComponentFixture<SaisiMandatParAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaisiMandatParAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaisiMandatParAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
