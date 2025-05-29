import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RemoteErrorMessageSnackbarComponent} from '@sycadApp/shared/app-toast/snackbar.component';
import { RegionElement } from '@sycadApp/models/data-references/territoire/region.model';
import { RegionsService } from '@sycadApp/services/data-references/territoire/regions-services';

import {SycadUtils} from '@sycadShared/utils.functions';
@Component({
  selector: 'app-form-region',
  templateUrl: './form-region.component.html',
  styleUrls: ['./form-region.component.scss']
})
export class FormRegionComponent implements OnInit {

  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean = false;

  get nom() {return this.formulaire.get('nom')};
  get code() {return this.formulaire.get('code')};

  constructor(public dialogRef: MatDialogRef<FormRegionComponent>,
              @Inject(MAT_DIALOG_DATA) public region: RegionElement, private _snackBar: MatSnackBar,
              public fb: FormBuilder, public RegionsService: RegionsService)
  {
    this.formulaire = this.fb.group({
      id: null,
      nom: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    if(this.region){
      this.formulaire.setValue({
        id: this.region.id,
        code: this.region.code,
        nom: this.region.nom
      });
    } else {
      this.region = new RegionElement();
    }
  }

  onSubmit(){
    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults = true;
        if (this.formulaire.value.id) {
          this.RegionsService.update(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults = false;
              this.dialogRef.close(data);
            },
            errorResponse => {
              this.isLoadingResults = false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
              }
          );
        } else {
          this.RegionsService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults = false;
              this.dialogRef.close(this.formulaire.value);
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
