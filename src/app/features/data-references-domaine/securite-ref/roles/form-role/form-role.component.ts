import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Subject, of } from 'rxjs';

import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { PermissionService } from '@sycadApp/services/data-references/security/permissions-services';
import { RolesService } from '@sycadApp/services/data-references/security/roles-services';import { MatSnackBar } from '@angular/material/snack-bar';
import { RemoteErrorMessageSnackbarComponent } from '@sycadApp/shared/app-toast/snackbar.component';
import { GlobalPattern } from '@sycadApp/shared/validators/global-pattern';
import { Permission } from '@sycadApp/models/data-references/security/permission.model';
import { RoleElement } from '@sycadApp/models/data-references/security/role.model';
import {SycadUtils} from '@sycadShared/utils.functions';


 



@Component({
  selector: 'app-form-role',
  templateUrl: './form-role.component.html',
  styleUrls: ['./form-role.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormRoleComponent implements OnInit {

  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean = false;

  public permissionsRemoteAutocomplete = new RemoteAutocomplete<Permission>();
  public excludesRemoteAutocomplete = new RemoteAutocomplete<Permission>();


  get libelle() { return this.formulaire.get('libelle'); }
  get code() { return this.formulaire.get('code'); }
  get type() { return this.formulaire.get('type'); }
  get permissions() { return this.formulaire.get('permissions'); }
  get excludes() { return this.formulaire.get('excludes'); }

  constructor(public dialogRef: MatDialogRef<FormRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public role: RoleElement, private _snackBar: MatSnackBar,
    public fb: FormBuilder, public permissionService: PermissionService, public rolesService: RolesService) {



    this.formulaire = this.fb.group({
      id: null,
      libelle: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      code: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(2), GlobalPattern.UppperCaseWithUnderscore]],
      type: [null, Validators.compose([Validators.required])],
      permissions: [null, Validators.compose([Validators.required])],
      excludes: [null]
    });


  }



  ngOnInit(): void {
    this.permissionsRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.permissionService);
    this.excludesRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.permissionService);

    if (this.role) {
      
      this.permissionsRemoteAutocomplete.listRessource$=of(this.role.permissions);
      this.permissionsRemoteAutocomplete.initialList=this.role.permissions;

      this.excludesRemoteAutocomplete.listRessource$=of(this.role.excludes);
      this.excludesRemoteAutocomplete.initialList=this.role.excludes;
      this.formulaire.setValue({
        id: this.role.id,
        code: this.role.code,
        libelle: this.role.libelle,
        permissions: this.role.permissions.map(perm=>perm.id),
        excludes: this.role.excludes.map(perm=>perm.id),
        type: this.role.type
      });


    }
    else {
      this.role = new RoleElement();

    }

  }


  public onSearchPermission(eventNgSelect) {
    this.permissionsRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchExlucision(eventNgSelect) {
    this.excludesRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults = true;
        if (this.formulaire.value.id) {
          this.rolesService.update(this.formulaire.value).subscribe(
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
          this.rolesService.add(this.formulaire.value).subscribe(
            data => {
              this.isLoadingResults = false;
              this.dialogRef.close(data);
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


