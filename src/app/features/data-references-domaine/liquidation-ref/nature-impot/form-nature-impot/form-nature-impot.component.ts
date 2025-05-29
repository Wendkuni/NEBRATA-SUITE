import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NatureImpot} from '@sycadApp/models/impot/nature-impot.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { NatureImpotService } from '@sycadApp/services/impot/nature-impot.service';
import {SycadUtils} from '@sycadShared/utils.functions';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {SystemImposition} from '@sycadApp/models/impot/system-imposition.model';
import { SystemImpositionService } from '@sycadApp/services/impot/system-imposition.service'

@Component({
  selector: 'app-form-nature-impot',
  templateUrl: './form-nature-impot.component.html',
  styleUrls: ['./form-nature-impot.component.scss']
})
export class FormNatureImpotComponent implements OnInit {
public formulaire: FormGroup;
private _onDestroy = new Subject<void>();
public isLoadingResults:boolean=false;

get code() { return this.formulaire.get('code');}
get libelle() { return this.formulaire.get('libelle');}
get typeNatureImpot() {return this.formulaire.get('typeNatureImpot');}
get codeSI() {return this.formulaire.get('codeSI');}
get libelleCourt() { return this.formulaire.get('libelleCourt');}

public codeSIRemoteAutocomplete = new RemoteAutocomplete<SystemImposition>();

typeNatureImpots = [
  "PERSONNELLE",
  "PROFESSIONNELLE"
];


  constructor(public dialogRef: MatDialogRef<FormNatureImpotComponent>,
              @Inject(MAT_DIALOG_DATA) public natureImpot: NatureImpot,
              public fb: FormBuilder, public _snackBar: MatSnackBar,
              public natureImpotService: NatureImpotService, public systemImpositionService: SystemImpositionService)
  {
   this.formulaire = this.fb.group({
     id: [null],
     code: [ null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
     libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
     typeNatureImpot: [null, [Validators.required]],
     codeSI: [null, [Validators.required]],
     libelleCourt: [null],
     ordre: [null]
   });
  }

  ngOnInit(): void {
  this.codeSIRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.systemImpositionService);


  if(this.natureImpot){

    if(this.natureImpot.codeSI){
      this.codeSIRemoteAutocomplete.listRessource$=of([this.natureImpot.codeSI]);
      this.codeSIRemoteAutocomplete.initialList=[this.natureImpot.codeSI];
    }

    this.formulaire.patchValue({
      id:this.natureImpot.id,
      code: this.natureImpot.code,
      libelle: this.natureImpot.libelle,
      typeNatureImpot: this.natureImpot.typeNatureImpot,
      codeSI: this.natureImpot.codeSI.id,
      libelleCourt: this.natureImpot.libelleCourt,
      ordre: this.natureImpot.ordre
    });
  } else {
    this.natureImpot = new NatureImpot();
  }
  }
public onSearchCodeSI(eventNgSelect){
  this.codeSIRemoteAutocomplete.term.next(eventNgSelect.term);
}
  onSubmit(){
  if(!this.formulaire.value){
    return false;
  }else {
    if(this.formulaire.value){
      this.isLoadingResults=true;
      if(this.formulaire.value.id){
        this.natureImpotService.update(this.formulaire.value).subscribe(data => {
          this.openSnackBar("Nature impôt modifié avec succès","OK");
          this.isLoadingResults=false;
          this.dialogRef.close(data);
        },
          errorResponse =>{
            this.isLoadingResults=false;
          SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
          }
        );
      }else {
        this.natureImpotService.add(this.formulaire.value).subscribe(data =>{
          this.openSnackBar("Nature impôt ajouté avec succès","OK");
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
