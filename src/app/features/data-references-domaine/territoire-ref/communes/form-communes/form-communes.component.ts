import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Subject, of} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GlobalPattern} from '@sycadShared/validators/global-pattern';
import {RemoteErrorMessageSnackbarComponent} from '@sycadApp/shared/app-toast/snackbar.component';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { HttpClient } from '@angular/common/http';
import { ProvinceAutocomplete } from '@sycadApp/models/data-references/territoire/province.model';
import { CommuneElement } from '@sycadApp/models/data-references/territoire/commune.model';
import { ProvincesService } from '@sycadApp/services/data-references/territoire/provinces.service';
import {SycadUtils} from '@sycadShared/utils.functions';


@Component({
  selector: 'app-form-communes',
  templateUrl: './form-communes.component.html',
  styleUrls: ['./form-communes.component.scss']
})
export class FormCommuneComponent implements OnInit {

  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean = false;
  typeCommunes = [
    'URBAINE',
    'RURALE',
    'PARTICULIER'
  ];

  public provinceRemoteAutocomplete = new RemoteAutocomplete<ProvinceAutocomplete>();

  get code() { return this.formulaire.get('code'); }
  get nom() { return this.formulaire.get('nom'); }
  get typeCommune() { return this.formulaire.get('typeCommune'); }
  get province() { return this.formulaire.get('province'); }
  constructor(public dialogRef: MatDialogRef<FormCommuneComponent>,
              @Inject(MAT_DIALOG_DATA) public commune: CommuneElement, private _snackBar: MatSnackBar,
              public fb: FormBuilder,
              private http: HttpClient,
              public provinceservice: ProvincesService,
              public communeService: CommunesService
              )
  {
    this.formulaire = this.fb.group({
      id: null,
      nom: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      typeCommune: [null, Validators.compose([Validators.required])],
      province:[null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit(): void {
    this.provinceRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.provinceservice);
    if(this.commune){

      this.provinceRemoteAutocomplete.listRessource$=of([this.commune.province]);
      this.provinceRemoteAutocomplete.initialList=[this.commune.province];

      this.formulaire.setValue({
        id: this.commune.id,
        code: this.commune.code,
        nom: this.commune.nom,
        typeCommune: this.commune.typeCommune,
        province: this.commune.province.id
      });




    } else {
      this.commune = new CommuneElement();
    }
  }


  public onSearchProvince(eventNgSelect) {
    this.provinceRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults = true;
        if (this.formulaire.value.id) {
          this.communeService.update(this.formulaire.value).subscribe(
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
          this.communeService.add(this.formulaire.value).subscribe(
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


  //
  /*destructure d'instance*/

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
  /*fin destructure d'instance*/

}
