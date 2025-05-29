import {Component, Input, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MediaChange, MediaObserver} from '@angular/flex-layout';



@Component({
  selector: 'app-attributaire-form',
  templateUrl: './attributaire-form.component.html',
  styleUrls: ['./attributaire-form.component.scss']
})
export class AttributaireFormComponent implements OnInit {
  private _onDestroy = new Subject<void>();
  @Input("formGroup") attributaireForm: FormGroup;
  get nom () { return this.attributaireForm.get('nom');}
  get prenoms() { return this.attributaireForm.get('prenoms');}
  get nomJeuneFille() { return this.attributaireForm.get('nomJeuneFille');}
  get profession() { return this.attributaireForm.get('profession');}
  public typeContribuables = [
    'CONTRIBUABLE PHYSIQUE',
    'CONTRIBUABLE MORALE'
  ];
  constructor( private fb: FormBuilder,
               private mediaObserver: MediaObserver) { }

  public activeMediaQuery = '';

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
