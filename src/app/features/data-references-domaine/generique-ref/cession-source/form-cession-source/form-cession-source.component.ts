import {Component, Inject, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { CessionSource } from '@sycadApp/models/workflow/common/attribution-source.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-form-cession-source',
  templateUrl: './form-cession-source.component.html',
  styleUrls: ['./form-cession-source.component.scss']
})
export class FormCessionSourceComponent implements OnInit {

public formulaire: FormGroup;
private _onDestroy = new Subject<void>();
public  isLoadingResults:boolean=false;
attributionTypes = [
  'AFFECTATION',
  'ATTRIBUTION',
  'BAIL',
  'MUTATION',
  'RETRAIT',

];
get code() { return this.formulaire.get('code');}
get libelle() { return this.formulaire.get('libelle');}
get attributionType() {return this.formulaire.get('type');}

  constructor(public dialogRef: MatDialogRef<FormCessionSourceComponent>,
@Inject(MAT_DIALOG_DATA) public attributionSource: CessionSource, public fb: FormBuilder,
public _snackBar: MatSnackBar, public attributionSourceService: CessionSourceService)
  {
    this.formulaire = this.fb.group({
      id: [null],
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      type: [null, Validators.compose([Validators.required])]
    });
  }


  ngOnInit(): void {
  if(this.attributionSource){

    this.formulaire.setValue({
      id: this.attributionSource.id,
      code: this.attributionSource.code,
      libelle: this.attributionSource.libelle,
      type: this.attributionSource.type
    });
  } else{
    this.attributionSource = new CessionSource();
  }
  }
onSubmit(){
  if(!this.formulaire.value){
    return false;
  }else {
    if(this.formulaire.value){
      this.isLoadingResults=true;
      if(this.formulaire.value.id){
        this.attributionSourceService.update(this.formulaire.value).subscribe(data =>{
          this.isLoadingResults=false;
          this.dialogRef.close(data);
        },
          errorResponse =>{
            this.isLoadingResults=false;
          SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
          }
        );
      }else{
        this.attributionSourceService.add(this.formulaire.value).subscribe(data =>{
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

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
