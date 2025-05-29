import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValiderFusionComponent } from './valider-fusion.component';


describe('ValiderMocellementComponent', () => {
  let component: ValiderFusionComponent;
  let fixture: ComponentFixture<ValiderFusionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValiderFusionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValiderFusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
