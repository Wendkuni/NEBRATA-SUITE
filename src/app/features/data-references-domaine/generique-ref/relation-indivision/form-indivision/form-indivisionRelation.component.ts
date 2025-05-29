import {Component, OnInit, Inject, ViewEncapsulation, ViewChild, TemplateRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {Subject, of, concat} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RemoteErrorMessageSnackbarComponent } from '@sycadApp/shared/app-toast/snackbar.component';
import { IndivisionrelationService } from '@sycadApp/services/data-references/contribuables/indivisionRelation.service';
import { IndivisionRelationElement } from '@sycadApp/models/data-references/system/indivision-relation.model';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-form-indivisionRelation',
  templateUrl: './form-indivisionRelation.component.html',
  styleUrls: ['./form-indivisionRelation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormIndivisionRelationComponent implements OnInit {

  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean=false;



  public qualiteList =[];
  get libelle() { return this.formulaire.get('libelle'); }
  get qualites(): FormArray { return this.formulaire.get('qualites') as FormArray;}

  constructor(public dialogRef: MatDialogRef<FormIndivisionRelationComponent>,
              @Inject(MAT_DIALOG_DATA) public indivisionrelation: IndivisionRelationElement, private _snackBar: MatSnackBar,
              public fb: FormBuilder, public Indivisionrelationservice: IndivisionrelationService) {

    this.formulaire = this.fb.group({
      id: null,
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      qualites:  new FormArray([])
    });
  }

  addNewQualite() {
    this.qualites.push(this.fb.group(
      {
        id: [null],
        libelle: [null, Validators.compose([Validators.required])],
        multiple:true
      }));
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition:'top'

    });
  }
  removeQualite(index) {
    if(this.indivisionrelation.id) {
      let qualite = this.qualites.at(index);

      this.Indivisionrelationservice.deleteQualitesIndivision(qualite.value.id).subscribe(
         result => {
          this.openSnackBar("La relation d'indivision est supprimée avec succès","OK");
          this.qualites.removeAt(index);
        },
        errorResponseQualite => {
          SycadUtils.notifyRemoteError(errorResponseQualite.error, this._snackBar);
        }

      );

    }else{
      this.qualites.removeAt(index);
    }
  }
  ngOnInit(): void {
    if (this.indivisionrelation) {
      this.formulaire.setValue({
        id:this.indivisionrelation.id,
        libelle: this.indivisionrelation.libelle,
        qualites:[]
      });


     this.indivisionrelation.qualites.map(qualite => {
        this.qualites.push(this.fb.group(
          {
            id: [qualite.id],
            libelle: [
              qualite.libelle, Validators.compose([Validators.required]),
            ],
            multiple: [
              qualite.multiple, Validators.compose([Validators.required]),
            ]
          }));
      });

    }
    else {
      this.indivisionrelation = new IndivisionRelationElement();
    }
  }



  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    } else {
      if (this.formulaire.value) {
        this.isLoadingResults=true;
        let {qualites,id,libelle} = this.formulaire.value;

        let formDataRelation= {id,libelle};
        if (formDataRelation.id) {
          this.Indivisionrelationservice.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.dialogRef.close(data);
              this.Indivisionrelationservice.updateQualitesIndivision(formDataRelation.id,qualites).subscribe(
                dataResultQualite => {
                  this.isLoadingResults=false;
                      // // console.log("Modification qualite reussie ",dataResultQualite);
                  this.openSnackBar("La relation d'indivision est modifiée avec succès","OK");
                  this.dialogRef.close(data);
                },
                 errorResponseQualite => {
                  this.isLoadingResults=false;
                 SycadUtils.notifyRemoteError(errorResponseQualite.error, this._snackBar);
            }
              );

            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
              }
          );
        } else {
          this.Indivisionrelationservice.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults=false;
              this.openSnackBar("La relation d'indivision est ajoutée avec succès","OK");
              this.dialogRef.close(data);
              let idRelation=data["id"];

/*
              this.Indivisionrelationservice.updateQualitesIndivision(idRelation,qualites).subscribe(
                dataResultQualite => {
                       //// console.log("Modification qualite reussie ",dataResultQualite);
                        this.dialogRef.close(data);
                },
                 errorResponseQualite => {
                 SycadUtils.notifyRemoteError(errorResponseQualite.error, this._snackBar);
            }
              );*/
            },
            errorResponse => {
              this.isLoadingResults=false;
             SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
              }
          );
        }
      }
    }
  }
  //
  /*destructure d'instance*/
  closeFormModal(): void {
    this.dialogRef.close();
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  /*fin destructure d'instance*/
}


