import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ElementLiquidation} from '@sycadApp/models/impot/element-liquidation.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ElementLiquidationService } from '@sycadApp/services/impot/element-liquidation.service';
import {SycadUtils} from '@sycadShared/utils.functions';
import {
  RemoteAutocomplete
} from "@sycadShared/form-components/model/remote-autocomplete";
import {
  NatureImpot
} from "@sycadApp/models/impot/nature-impot.model";
import {
  NatureImpotService
} from "@sycadApp/services/impot/nature-impot.service";

@Component({
  selector: 'app-form-element-liquidation',
  templateUrl: './form-element-liquidation.component.html',
  styleUrls: ['./form-element-liquidation.component.scss']
})
export class FormElementLiquidationComponent implements OnInit {

  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;
  public natureImpotRemoteAutocomplete = new RemoteAutocomplete<NatureImpot>();
  get code(){ return this.formulaire.get('code');}
  get libelle(){ return this.formulaire.get('libelle');}

  get fonctions() {
    return this.formulaire.get('fonctions');
  }

  get unite() {
    return this.formulaire.get('unite');
  }
  get natureImpot(){
    return this.formulaire.get('natureImpot');
  }
signes = [
  "POSITIF",
  "NEGATIF",
  "NULL"
];
  constructor(public dialogRef: MatDialogRef<FormElementLiquidationComponent>,
              @Inject(MAT_DIALOG_DATA) public elementLiquidation: ElementLiquidation,
              public fb: FormBuilder, public _snackBar: MatSnackBar,public natureImpotService: NatureImpotService,
              public elementLiquidationService: ElementLiquidationService)
  {
    this.formulaire = this.fb.group({
      id:[ null],
      code: [null, [Validators.required]],
      libelle: [null, [Validators.required]],
      signe: [null],
      fonctions: [null],
      unite: [null, [Validators.required]],
      natureImpot: [null]
    });
  }

  ngOnInit(): void {
    this.natureImpotRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.natureImpotService);
    if(this.elementLiquidation){
      this.formulaire.setValue({
        id: this.elementLiquidation.id,
        code: this.elementLiquidation.code,
        libelle: this.elementLiquidation.libelle,
        signe:this.elementLiquidation.signe,
        fonctions:this.elementLiquidation.fonctions,
        unite: this.elementLiquidation.unite,
        natureImpot:  this.elementLiquidation.natureImpot
          ? this.elementLiquidation.natureImpot.id
          : 1|| null
      });
    }else {
      this.elementLiquidation = new ElementLiquidation();
    }
  }
  public onSearchNatureImpot(eventNgSelect){
    this.natureImpotRemoteAutocomplete.term.next(eventNgSelect.term);
  }
onSubmit(){
    if(!this.formulaire.value){
      return false;
    }else {
      if(this.formulaire.value){
        this.isLoadingResults=true;
        if(this.formulaire.value.id){
          this.elementLiquidationService.update(this.formulaire.value).subscribe(data =>{
            this.openSnackBar("Elément liquidation modifié avec succès","OK");
            this.isLoadingResults=false;
            this.dialogRef.close(data);
          },
            errorResponse =>{
              this.isLoadingResults=false;
            SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        }else {
          this.elementLiquidationService.add(this.formulaire.value).subscribe(data =>{
            this.openSnackBar("Elément liquidation ajouté avec succès","OK");
            this.isLoadingResults=false;
            this.dialogRef.close(data);
          },
            errorResponse =>{
            this.isLoadingResults=false;
            SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        }
      }
    }
}
  closeFormModal(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
