import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {RemoteAutocomplete} from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {CommuneAutocomplete} from '@sycadApp/models/data-references/territoire/commune.model';
import {ArrondissementAutocomplete} from '@sycadApp/models/data-references/territoire/arrondissement.model';
import {ArrondissementZone} from '@sycadApp/models/data-references/territoire/arrondissement-zone.model';
import {DestinationParcelle} from '@sycadApp/models/bornage/destinationParcelle.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ParcelleBareme} from '@sycadApp/models/cession-parcelle/parcelle-bareme.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ParcelleBaremeService } from '@sycadApp/services/evaluation/parcelle-bareme.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { ArrondissementZoneService } from '@sycadApp/services/data-references/territoire/arrondissement-zone.service';

import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import {SycadUtils} from '@sycadShared/utils.functions';

@Component({
  selector: 'app-form-parcelle-bareme',
  templateUrl: './form-parcelle-bareme.component.html',
  styleUrls: ['./form-parcelle-bareme.component.scss']
})
export class FormParcelleBaremeComponent implements OnInit {
public formulaire: FormGroup;
private _onDestroy = new Subject<void>();
public  isLoadingResults:boolean=false;

public communeRemoteAutocomplete = new RemoteAutocomplete<CommuneAutocomplete>();
public arrondissementRemoteAutocomplete = new RemoteAutocomplete<ArrondissementAutocomplete>();
public arrondissementZoneRemoteAutocomplete = new RemoteAutocomplete<ArrondissementZone>();
public destinationRemoteAutocomplete = new RemoteAutocomplete<DestinationParcelle>();

get valeur() {return this.formulaire.get('valeur');}
get commune() {return this.formulaire.get('commune');}
get arrondissement() {return this.formulaire.get('arrondissement');}
get destination() {return this.formulaire.get('destination');}


  constructor(public dialogRef: MatDialogRef<FormParcelleBaremeComponent>,
              @Inject(MAT_DIALOG_DATA) public parcelleBareme: ParcelleBareme,
              public fb: FormBuilder, public _snackBar: MatSnackBar,
              public parcelleBaremeService: ParcelleBaremeService, public communeService: CommunesService,
              public arrondissementService: ArrondissementsService, public arrondissementZoneService: ArrondissementZoneService,
              public destinationService: DestinationParcelleService)
  {
    this.formulaire = this.fb.group({
      id: [null],
      valeur: [null, Validators.compose([Validators.required])],
      commune: [null, Validators.compose([Validators.required])],
      arrondissement: [null, Validators.compose([Validators.required])],
      arrondissementZone: [null],
      destination: [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit(): void {
  this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
  this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementService);
  this.arrondissementZoneRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementZoneService);
  this.destinationRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.destinationService);

  if(this.parcelleBareme){

    if(this.parcelleBareme.arrondissement.commune){
      this.communeRemoteAutocomplete.listRessource$= of([this.parcelleBareme.arrondissement.commune]);
      this.communeRemoteAutocomplete.initialList=[this.parcelleBareme.arrondissement.commune];
    }
    if(this.parcelleBareme.arrondissement){
      this.arrondissementRemoteAutocomplete.listRessource$=of([this.parcelleBareme.arrondissement]);
      this.arrondissementRemoteAutocomplete.initialList=[this.parcelleBareme.arrondissement];
    }
    if(this.parcelleBareme.arrondissementZone){
      this.arrondissementZoneRemoteAutocomplete.listRessource$= of([this.parcelleBareme.arrondissementZone]);
      this.arrondissementZoneRemoteAutocomplete.initialList=[this.parcelleBareme.arrondissementZone];
    }
    if(this.parcelleBareme.destination){
      this.destinationRemoteAutocomplete.listRessource$= of([this.parcelleBareme.destination]);
      this.destinationRemoteAutocomplete.initialList=[this.parcelleBareme.destination];
    }

    this.formulaire.patchValue({
      id: this.parcelleBareme.id,
      commune:this.parcelleBareme.arrondissement?.commune?.id,
      valeur: this.parcelleBareme.valeur,
      arrondissement: this.parcelleBareme.arrondissement?.id,
      arrondissementZone: this.parcelleBareme.arrondissementZone?.id,
      destination: this.parcelleBareme.destination?.id
    });

  } else{
    this.parcelleBareme = new ParcelleBareme();
  }
}
public onSearchCommune(eventNgSelect){
  this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
}
public onSearchArrondissement(eventNgSelect){
  this.arrondissementRemoteAutocomplete.term.next(eventNgSelect.term);
}
public onSearchArrondissementZone(eventNgSelect){
  this.arrondissementZoneRemoteAutocomplete.term.next(eventNgSelect.term);
}
public onSearchDestination(eventNgSelect){
  this.destinationRemoteAutocomplete.term.next(eventNgSelect.term);
}


onSubmit(){
  if(!this.formulaire.value){
    return false;
  }else {
    if(this.formulaire.value){
      this.isLoadingResults=true;
      if(this.formulaire.value.id){
        this.parcelleBaremeService.update(this.formulaire.value).subscribe(data => {
          this.openSnackBar("Parcelle barême modifié avec succès","OK");
          this.isLoadingResults=false;
          this.dialogRef.close(data);
        },
          errorResponse =>{
            this.isLoadingResults=false;
          SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
          }
          );
      } else {
        this.parcelleBaremeService.add(this.formulaire.value).subscribe(data =>{
          this.openSnackBar("Parcelle barême ajouté avec succès","OK");
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
