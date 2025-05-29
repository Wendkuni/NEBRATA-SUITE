import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigProcessusComponent } from './config-processus.component';

describe('ConfigProcessusComponent', () => {
  let component: ConfigProcessusComponent;
  let fixture: ComponentFixture<ConfigProcessusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigProcessusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigProcessusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
