import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ProvincesService } from '@sycadApp/services/data-references/territoire/provinces.service';
import { RegionsService } from '@sycadApp/services/data-references/territoire/regions-services';
import { RegionElement } from '@sycadApp/models/data-references/territoire/region.model';
import { ProvinceElement } from '@sycadApp/models/data-references/territoire/province.model';
import {SycadUtils} from '@sycadShared/utils.functions';
import {MediaObserver} from '@angular/flex-layout';
import { NgSelectConfig } from '@ng-select/ng-select';
import { AdvancedRemoteAutocomplete } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/advanced-remote-autocomplete';
import { RemoteAutocompleteTableMetaData } from '@sycadApp/shared/form-components/data-references-domaine/field-remote-autocomplete/model-advanced-remote-autocomplete';
import { catchError, map } from 'rxjs/operators';
@Component({
  selector: 'app-form-provinces',
  templateUrl: './form-provinces.component.html',
  styleUrls: ['./form-provinces.component.scss']
})
export class FormProvincesComponent implements OnInit {
  public formulaire: FormGroup;
  private _onDestroy = new Subject<void>();
  public isLoadingResults:boolean = false;
  public regionRemoteAutocomplete = new RemoteAutocomplete<RegionElement>();
  public remoteAutocompleteRegion  = new AdvancedRemoteAutocomplete<RegionElement>();
  public tableDescription: RemoteAutocompleteTableMetaData;


  get code() { return this.formulaire.get('code'); }
  get nom() { return this.formulaire.get('nom'); }
  get region() { return this.formulaire.get('region'); }


  constructor(public dialogRef: MatDialogRef<FormProvincesComponent>,
              @Inject(MAT_DIALOG_DATA) public province: ProvinceElement, private _snackBar: MatSnackBar,
              public fb: FormBuilder, public provincesService: ProvincesService, public regionService: RegionsService)
  {
    this.formulaire = this.fb.group({
      id: null,
      code: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      nom: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      region: [null, Validators.compose([Validators.required])],
   //   region1: [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit(): void {


    let callbackAutocomplete=(search:string,params:Map<string,any>)=> {
      return this.regionService.autocompletion(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };
    this.regionRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.regionService);
    this.remoteAutocompleteRegion.initializeRemoteAutocompletion(this._onDestroy);
    this.remoteAutocompleteRegion.customNgSelectConfig.multiple = false;
    this.remoteAutocompleteRegion.customNgSelectConfig.controlName = 'region';
    this.remoteAutocompleteRegion.customNgSelectConfig.libelle = 'nom';
    this.remoteAutocompleteRegion.customNgSelectConfig.formulaire = this.formulaire;
    this.remoteAutocompleteRegion.nativeNgSelectConfig.placeholder = 'Choisir la région (*)';
    this.remoteAutocompleteRegion.nativeNgSelectConfig.appendTo = 'body';
    this.remoteAutocompleteRegion.nativeNgSelectConfig.bindValue = 'id';

    this.remoteAutocompleteRegion.customNgSelectConfig.callbackAutocomplete=callbackAutocomplete;
    const colTab = [
      {name: 'code', label: 'Code'},
      {name: 'nom', label: 'Nom'}];
    this.remoteAutocompleteRegion.tableDescription = this.remoteAutocompleteRegion.pushColumn(colTab, 'Tableau des regions');
    if(this.province){
      this.regionRemoteAutocomplete.listRessource$=of([this.province.region]);
      this.regionRemoteAutocomplete.initialList=[this.province.region];


      this.formulaire.setValue({
        id: this.province.id,
        code: this.province.code,
        nom: this.province.nom,
        region: this.province.region.id

      });
    }else {
      this.province = new ProvinceElement();
    }
  }

  public onSearchRegion(eventNgSelect) {
    this.regionRemoteAutocomplete.term.next(eventNgSelect.term);
  }




  onSubmit() {

    if (!this.formulaire.valid) {
      return false;
    } else {

      if (this.formulaire.value) {
        this.isLoadingResults = true;
        if (this.formulaire.value.id) {
          this.provincesService.update(this.formulaire.value).subscribe(
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
          this.provincesService.add(this.formulaire.value).subscribe(
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
