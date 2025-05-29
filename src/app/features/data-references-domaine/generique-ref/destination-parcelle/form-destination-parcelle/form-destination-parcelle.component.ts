import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {StructureAutocomplete} from '@sycadApp/models/data-references/organigramme/structure.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DestinationParcelle} from '@sycadApp/models/bornage/destinationParcelle.model';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {SycadUtils} from '@sycadShared/utils.functions';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-destination-parcelle',
  templateUrl: './form-destination-parcelle.component.html',
  styleUrls: ['./form-destination-parcelle.component.scss']
})
export class FormDestinationParcelleComponent implements OnInit {
public destinationFormulaire : FormGroup;
private _onDestroy = new Subject<void>();
public isLoadingResults:boolean=false;
public structureRemoteAutocomplete = new RemoteAutocomplete<StructureAutocomplete>();


   get code(){return this.destinationFormulaire.get('code');}
  get libelle() { return this.destinationFormulaire.get('libelle');}

  constructor(public dialogRef: MatDialogRef<FormDestinationParcelleComponent>,
              @Inject(MAT_DIALOG_DATA) public destination: DestinationParcelle, public fb: FormBuilder,
              public destinationService: DestinationParcelleService, private _snackBar: MatSnackBar, public structureService: StructureService)
  {
    this.destinationFormulaire = this.fb.group({
      id: [null],
      code: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      libelle: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      tutelle: [null]
    });
  }

  ngOnInit(): void {
     this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);


     if(this.destination){


      if(this.destination.tutelle) {
        this.structureRemoteAutocomplete.listRessource$=of([this.destination.tutelle]);
        this.structureRemoteAutocomplete.initialList = [this.destination.tutelle];
      }


       this.destinationFormulaire.patchValue({
         id: this.destination.id,
         code: this.destination.code,
         libelle: this.destination.libelle,
         tutelle: this.destination.tutelle?.id
       });
     } else {
       this.destination = new DestinationParcelle();
     }
  }
public onSearchStructure(eventNgSelect){
     this.structureRemoteAutocomplete.term.next(eventNgSelect.term);
}
  onSubmit() {

    if (!this.destinationFormulaire.valid) {
      return false;
    } else {

      if (this.destinationFormulaire.value) {
        this.isLoadingResults=true;
        if (this.destinationFormulaire.value.id) {
          this.destinationService.update(this.destinationFormulaire.value).subscribe(
            data => {
              this.openSnackBar("Destination parcelle modifié avec succès","OK");
              this.isLoadingResults=false;
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );
        } else {
          this.destinationService.add(this.destinationFormulaire.value).subscribe(
            data => {
              this.openSnackBar("Destination parcelle ajouté avec succès","OK");
              this.isLoadingResults=false;
              this.dialogRef.close(data);
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
