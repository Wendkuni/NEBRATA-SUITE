import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitreHonorifiqueComponent } from './titre-honorifique.component';

describe('TitreHonorifiqueComponent', () => {
  let component: TitreHonorifiqueComponent;
  let fixture: ComponentFixture<TitreHonorifiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitreHonorifiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitreHonorifiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
