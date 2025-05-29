import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitesCadastralesComponent } from './entites-cadastrales.component';

describe('EntitesCadastralesComponent', () => {
  let component: EntitesCadastralesComponent;
  let fixture: ComponentFixture<EntitesCadastralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntitesCadastralesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitesCadastralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
