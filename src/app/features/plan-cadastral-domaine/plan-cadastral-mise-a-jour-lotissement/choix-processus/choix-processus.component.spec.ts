import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoixProcessusComponent } from './choix-processus.component';

describe('ChoixProcessusComponent', () => {
  let component: ChoixProcessusComponent;
  let fixture: ComponentFixture<ChoixProcessusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoixProcessusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoixProcessusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
