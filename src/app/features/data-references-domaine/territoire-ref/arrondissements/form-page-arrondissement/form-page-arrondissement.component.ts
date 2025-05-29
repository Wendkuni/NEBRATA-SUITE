import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {of, Subject} from "rxjs";
import {ArrondissementElement, ArrondissementZone} from "@sycadApp/models/data-references/territoire/arrondissement.model";
import {RemoteAutocomplete} from "@sycadApp/shared/form-components/model/remote-autocomplete";
import {CommuneAutocomplete} from "@sycadApp/models/data-references/territoire/commune.model";
import {MediaChange, MediaObserver} from "@angular/flex-layout";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConfirmService} from "@sycadShared/app-confirm/app-confirm.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DateAdapter} from "@angular/material/core";
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import {takeUntil} from "rxjs/operators";
import {getErrors} from "@sycadShared/validators/global-pattern";
import {SycadUtils} from "@sycadShared/utils.functions";
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'app-form-page-arrondissement',
  templateUrl: './form-page-arrondissement.component.html',
  styleUrls: ['./form-page-arrondissement.component.scss']
})
export class FormPageArrondissementComponent implements OnInit {
  public formulaire: FormGroup;
  public arrondissement: ArrondissementElement;
  private _onDestroy = new Subject<void>();

  public isLoadingResults = false;

  public communeRemoteAutocomplete = new RemoteAutocomplete<CommuneAutocomplete>();

  get code() { return this.formulaire.get('code'); }
  get nom() { return this.formulaire.get('nom'); }
  get commune() { return this.formulaire.get('commune'); }
  get getZones() { return this.formulaire.controls.zones as FormArray ;}
  get codes() { return this.formulaire.get('zones').get('codes');}
  get libelle() { return this.formulaire.get('zones').get('libelle');}

  constructor(public fb: FormBuilder,private router: Router,
              public confirmService: AppConfirmService,
              private route: ActivatedRoute,
              private _snackBar: MatSnackBar, private mediaObserver: MediaObserver,
              private _adapter: DateAdapter<any>, public communeService: CommunesService,
              public arrondissementService: ArrondissementsService)
  {
    this.arrondissement = this.route.snapshot.data["arrondissement"];
    this.formulaire = this.fb.group({
      id: null,
      code: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      nom: [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      commune: [null, Validators.compose([Validators.required])],
      zones: new FormArray([])
    });
  }
  public formErrors: Array<string>;
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {
    this.formulaire.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.formErrors = getErrors(this.formulaire);
    });

    this._adapter.setLocale("fr");

    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    if(this.arrondissement){


      this.communeRemoteAutocomplete.listRessource$=of([this.arrondissement.commune]);
      this.communeRemoteAutocomplete.initialList=[this.arrondissement.commune];

      if(this.arrondissement.zones){
        this.arrondissement.zones.map(zone =>{
          this.getZones.insert(0, this.createZones(zone));
        });
      }
      this.formulaire.patchValue({
        id: this.arrondissement.id,
        code: this.arrondissement.code,
        nom: this.arrondissement.nom,
        commune: this.arrondissement.commune.id,
        zones: []
      });
    }else {
      this.arrondissement = new ArrondissementElement();
    }
  }
  public onSearchCommune(eventNgSelect){
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);

  }
  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.TERRITOIRE_ARRONDISSEMENT}`]);

  }
  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    } else {
      if (this.formulaire.value) {
        this.isLoadingResults=true;
        if (this.formulaire.value.id) {

          this.arrondissementService.update(this.formulaire.value).subscribe(data => {
              this.isLoadingResults=false;
              this.openSnackBar("L'arrondissement est modifié avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.TERRITOIRE_ARRONDISSEMENT]);
            },
            errorResponse => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
            }
          );

        } else {
          this.arrondissementService.add(this.formulaire.value).subscribe(data => {
              this.isLoadingResults=false;
              this.openSnackBar("L'arrondissement est ajouté avec succès","OK");
              this.router.navigate([environment.FRONTEND_ROUTES.TERRITOIRE_ARRONDISSEMENT]);
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

  createZones(zone: ArrondissementZone){
    if(zone){
      return this.fb.group({
        id: [zone.id],
        code: [zone.code],
        libelle: [zone.libelle]
      });
    }else {
      return this.fb.group({
        id: [null],
        code:  [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
        libelle:  [null, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]]
      });
    }
  }
  addNewZones(){
    this.getZones.insert(0, this.createZones(null));
  }
  removeZone(index){
    let zone = this.getZones.at(index);
    if (zone.value.id) {
      this.confirmService.confirm({
        title:"Confirmation",
        message:`Voulez-vous supprimer cette zone d'arrondissement ? `
      }).subscribe(($choix)=> {

        if($choix) {
          this.isLoadingResults=true;
          this.arrondissementService.deleteZones(this.arrondissement.id, zone.value.id).subscribe(
            (result) => {
              this.isLoadingResults=false;
              this.openSnackBar("La zone d'arrondissement est supprimée avec succès", "OK");
              this.getZones.removeAt(index);
            },
            (errorResponseMembre) => {
              this.isLoadingResults=false;
              SycadUtils.notifyRemoteError(errorResponseMembre.error, this._snackBar);
            }
          );
        }

      });
    } else {
      this.getZones.removeAt(index);
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }


}
