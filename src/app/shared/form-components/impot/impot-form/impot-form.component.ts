
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { DateAdapter } from '@angular/material/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Impot } from '@sycadApp/models/impot/mode-reglement.model';

@Component({
  selector: 'app-impot-form',
  templateUrl: './impot-form.component.html',
  styleUrls: ['./impot-form.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  encapsulation: ViewEncapsulation.None
})
export class ImpotFormComponent implements OnInit {


  private _onDestroy = new Subject<void>();
  @Input("formGroup") impotForm: FormGroup;
  
  @Input("data") impotData: Impot;

  get observation() { return this.impotForm.get('observation'); }
  get valeurElementLiquidations() { return this.impotForm.controls.valeurElementLiquidations as FormArray; }

  
  constructor(
    private fb: FormBuilder,
    public _snackBar: MatSnackBar,
    public _adapter: DateAdapter<any>,
    private mediaObserver: MediaObserver
    ) {}

    public activeMediaQuery = '';

    ngAfterContentInit() {
      this.mediaObserver.media$.subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
       //// console.log("this.activeMediaQuery",this.activeMediaQuery)
      });
    }
  ngOnInit(): void {
    this._adapter.setLocale("fr");

  // // console.log("impotData",this.impotData);
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  getValueElementLiquidation(valeurElementLiquidationForm: FormGroup) {  
    let id=valeurElementLiquidationForm.get('id').value;
    let lvel=  this.impotData.valeurElementLiquidations.filter(el=>el.id===id);
    return lvel.pop();
}

}
