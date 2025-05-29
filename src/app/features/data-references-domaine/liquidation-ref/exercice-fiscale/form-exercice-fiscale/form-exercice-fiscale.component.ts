import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ExerciceFiscale} from '@sycadApp/models/impot/exercice-fiscale.model';
import { ExerciceFiscaleService } from '@sycadApp/services/impot/exercice-fiscale.service';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-form-exercice-fiscale',
  templateUrl: './form-exercice-fiscale.component.html',
  styleUrls: ['./form-exercice-fiscale.component.scss']
})
export class FormExerciceFiscaleComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;
  get annee(){return this.formulaire.get('annee');}
  get libelle() { return this.formulaire.get('libelle');}
  get datedebut(){ return this.formulaire.get('datedebut');}
  get datefin(){return this.formulaire.get('datefin');}
  get etat(){return this.formulaire.get('etat');}
etats = [
  "CLOS",
  "OUVERT",
  "PROVISOIRE"
];
  constructor(public dialogRef: MatDialogRef<FormExerciceFiscaleComponent>,
              @Inject(MAT_DIALOG_DATA) public exerciceFiscale: ExerciceFiscale,
              public fb: FormBuilder, public _snackBar: MatSnackBar,
              public exerciceFiscaleService: ExerciceFiscaleService)
  {
   this.formulaire = this.fb.group({
     id: [null],
     annee: [null, [Validators.required]],
     libelle: [null, [Validators.required]],
     datedebut: [null, [Validators.required]],
     datefin: [null, [Validators.required]],
     etat: [null, [Validators.required]]
   });
  }

  ngOnInit(): void {
    if(this.exerciceFiscale){
      this.formulaire.setValue({
        id: this.exerciceFiscale.id,
        annee: this.exerciceFiscale.annee,
        libelle: this.exerciceFiscale.libelle,
        datedebut: this.exerciceFiscale.datedebut,
        datefin: this.exerciceFiscale.datefin,
        etat: this.exerciceFiscale.etat
      });
    }else {
      this.exerciceFiscale = new ExerciceFiscale();
    }
  }
  onSubmit(){
    if(!this.formulaire.value){
      return false;
    }else {
      if(this.formulaire.value){
        this.isLoadingResults=true;
        if(this.formulaire.value.id){
          this.exerciceFiscaleService.update(this.formulaire.value).subscribe(data => {
            this.openSnackBar("Exercice fiscale modifié avec succès","OK");
            this.isLoadingResults=false;
              this.dialogRef.close(data);
            },
            errorResponse =>{
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        }else {
          this.exerciceFiscaleService.add(this.formulaire.value).subscribe(data =>{
            this.openSnackBar("Exercice fiscale ajouté avec succès","OK");
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
