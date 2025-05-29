import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DateAdapter} from '@angular/material/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { ElementLiquidation } from '@sycadApp/models/impot/element-liquidation.model';
import { ElementLiquidationService } from '@sycadApp/services/impot/element-liquidation.service';
import { ElementImpot } from '@sycadApp/models/impot/element-impot.model';
import { DataSource } from '@angular/cdk/table';


@Component({
  selector: 'app-element-impot-form',
  templateUrl: './element-impot.component.html',
  styleUrls: ['./element-impot.component.scss']
})
export class ElementImpotComponent implements OnInit {
  private _onDestroy = new Subject<void>();
  @Input("formGroup") elementImpotForm: FormGroup;
  public liquidationRemoteAutocomplete = new RemoteAutocomplete<ElementLiquidation>();

    public liquidationChoisie;

  get elementLiquidation(){ return this.elementImpotForm.get('elementLiquidation');}
  get baseImpot() {return this.elementImpotForm.get('baseImpot');}
  get taux(){return this.elementImpotForm.get('taux');}
 
  constructor(public fb: FormBuilder, public _snackBar: MatSnackBar,
              public _adapter: DateAdapter<any>,
              public elementLiquidationService: ElementLiquidationService,
              private mediaObserver: MediaObserver)
               {
                this.elementImpotForm = this.fb.group({
                  id: [null],
                  elementLiquidation: [null, [Validators.required]],
                  baseImpot: this.fb.group({
                    id: [null],
                    titre:  [null, [Validators.required]],
                    expression: [null, [Validators.required]]
                  }),
                  taux:this.fb.group({
                    id: [null],
                    titre:  [null, [Validators.required]],
                    expression: [null, [Validators.required]]
                  }),
                  ordreTrie: [null]
                })
              }

  public activeMediaQuery = '';

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    }); 
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");
    this.liquidationRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.elementLiquidationService);

     if(this.elementImpotForm.value.elementLiquidation) {
     this.liquidationRemoteAutocomplete.listRessource$ = of([this.elementImpotForm.value.elementLiquidation]);
     this.liquidationRemoteAutocomplete.initialList = [this.elementImpotForm.value.elementLiquidation];
     this.liquidationChoisie=this.elementImpotForm.value.elementLiquidation;
     this.elementImpotForm.patchValue({
      elementLiquidation: this.elementImpotForm.value.elementLiquidation?.id,
    })

  
   }

    
 
  }
  onSearchLiquidation(eventNgSelect){
    this.liquidationRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  onChangeLiquidation(elLiq : ElementLiquidation){
    this.liquidationChoisie=elLiq;
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
