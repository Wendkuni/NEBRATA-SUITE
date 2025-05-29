import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {MatSnackBar} from '@angular/material/snack-bar';
import { QuartierService } from '@sycadApp/services/data-references/territoire/quartier.service';
import {SycadUtils} from '@sycadShared/utils.functions';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {CommuneAutocomplete} from '@sycadApp/models/data-references/territoire/commune.model';
import {Quartier} from '@sycadApp/models/data-references/territoire/quartier.model';

@Component({
  selector: 'app-form-quartier',
  templateUrl: './form-quartier.component.html',
  styleUrls: ['./form-quartier.component.scss']
})
export class FormQuartierComponent implements OnInit {
public quartierFormulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean = false;

  public communeRemoteAutocomplete = new RemoteAutocomplete<CommuneAutocomplete>();

get nom(){return this.quartierFormulaire.get("nom");}
get commune(){ return this.quartierFormulaire.get('commune');}


  constructor(public dialogRef: MatDialogRef<FormQuartierComponent>,
              @Inject(MAT_DIALOG_DATA) public quartier: Quartier, public fb: FormBuilder,
              public _snackBar: MatSnackBar, public quartierService: QuartierService, public communeService: CommunesService)
  {
    this.quartierFormulaire = this.fb.group({
      id: [null],
      nom: [null, [Validators.compose([Validators.required])]],
      commune: [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit(): void {
  this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    if(this.quartier){
      if(this.quartier.commune){
        this.communeRemoteAutocomplete.listRessource$= of([this.quartier.commune]);
        this.communeRemoteAutocomplete.initialList= [this.quartier.commune];
      }
     this.quartierFormulaire.setValue({
       id: this.quartier.id,
       nom: this.quartier.nom,
       commune: this.quartier.commune?.id
     });

    }else{
      this.quartier = new Quartier();
    }
  }
  onSubmit(){
  if(!this.quartierFormulaire.value){
    return false;
  } else {
    if(this.quartierFormulaire.value){
      this.isLoadingResults = true;
      if(this.quartierFormulaire.value.id) {
        this.quartierService.update(this.quartierFormulaire.value).subscribe(
          data =>{
            this.isLoadingResults = false;
            this.dialogRef.close(data);
          },
          errorResponse => {
            this.isLoadingResults = false;
            SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
          }
        );
      }else{
        this.quartierService.add(this.quartierFormulaire.value).subscribe(
          data => {
            this.isLoadingResults = false;
            this.dialogRef.close(this.quartierFormulaire.value);
          },
          errorResponse => {
            this.isLoadingResults = false;
            SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
          }
        );
      }
    }
  }
  }

  public onSearchCommune(eventNgSelect){
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
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
