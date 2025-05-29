import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import {FormBuilder, Validators} from '@angular/forms';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {of} from 'rxjs';
import {SycadUtils} from '@sycadShared/utils.functions';
import {MatDialog} from '@angular/material/dialog';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {ActeurAutocomplete} from '@sycadApp/models/data-references/contribuables/acteur.model';
import {CategoriePieceProcessus} from '@sycadApp/models/workflow/common/general';
import { environment } from 'environments/environment';
import { SdMajService } from '@sycadApp/services/workflow/common/regularisation.service';
import { TransitionSdMajPlanComponent } from '../transition-sd-maj-plan.component';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import {
  CommuneAutocomplete
} from "@sycadApp/models/data-references/territoire/commune.model";

@Component({
  selector: 'pc-saisie-sd-maj',
  templateUrl: './saisie-maj-plan.component.html',
  styleUrls: ['./saisie-maj-plan.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieSdMajPlanComponent extends TransitionSdMajPlanComponent implements OnInit {
  communeAuto: CommuneAutocomplete;
  constructor(public dialog: MatDialog,
  public router: Router,
  public _snackBar: MatSnackBar,
  public confirmService: AppConfirmService,
  public _adapter: DateAdapter<any>,
  public mediaObserver: MediaObserver,
  public fb: FormBuilder,
  public categoriePieceService: CategoriePieceService,
  public communeService: CommunesService,
  public sdMajService: SdMajService,
  public acteurService: ActeursService,
  public contribuableService: ContribuableService,
  public structureService: StructureService,
  public parcelleService: ParcelleService,
  public mandatService: MandatService)
  {
    super(router, dialog, _snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, sdMajService,
      acteurService, contribuableService, structureService, parcelleService, mandatService);
    this.formulaire.addControl('action',this.fb.control(null, [Validators.required]));
    this.formulaire.addControl('numero', this.fb.control(null, [Validators.required]));
  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  ngOnInit(): void {
    this._adapter.setLocale('fr');
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteActeurPromoteur();
    this.contribuableBeneficiaireChoisie = this.sdMaj?.contribuableBeneficiaire;
    this.structureBeneficiaireChoisie = this.sdMaj?.structureBeneficiaire;
    if (this.sdMaj.acteurExterne) {
      let acteurEl: ActeurAutocomplete = new ActeurAutocomplete();

      acteurEl.denomination = this.sdMaj.acteurExterne.denomination;
      acteurEl.guid = this.sdMaj.acteurExterne.guid;
      acteurEl.statusJuridique = this.sdMaj.acteurExterne.statusJuridique.libelle;
      acteurEl.sigle = this.sdMaj.acteurExterne.sigle;
      acteurEl.username = this.sdMaj.acteurExterne.username;
      acteurEl.categorie = this.sdMaj.acteurExterne?.categorie?.libelle;

      this.acteurRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([acteurEl]);
      this.acteurRemoteAutocomplete.initialList = [acteurEl];
    }
    if (this.sdMaj.promoteurImmobilier) {
      let acteurEl: ActeurAutocomplete = new ActeurAutocomplete();

      acteurEl.denomination = this.sdMaj.promoteurImmobilier.denomination;
      acteurEl.guid = this.sdMaj.promoteurImmobilier.guid;
      acteurEl.statusJuridique = this.sdMaj.promoteurImmobilier.statusJuridique.libelle;
      acteurEl.sigle = this.sdMaj.promoteurImmobilier.sigle;
      acteurEl.username = this.sdMaj.promoteurImmobilier.username;
      acteurEl.categorie = this.sdMaj.promoteurImmobilier?.categorie?.libelle;

      this.acteurBeneficiaireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([acteurEl]);
      this.acteurBeneficiaireRemoteAutocomplete.initialList = [acteurEl];
    }
    this.parcellesChoisies = this.sdMaj.parcellesADesactive;
    this.ilotsChoisies = this.sdMaj.ilotsADesactive;
    this.newParcelles = this.sdMaj.parcellesAAjouter;
    this.editParcelles = this.sdMaj.parcellesAModifier;

    this.ilotsAjoutes=this.sdMaj.ilotsAAjouter;
    this.ilotsModifies=this.sdMaj.ilotsAModifier;

    this.communeRemoteAutocomplete.listRessource$ = of([this.sdMaj.commune]);
    this.communeRemoteAutocomplete.initialList = [this.sdMaj.commune];


    this.formulaire.patchValue({
      numero: this.sdMaj.numero,
      action: this.transition.code,
      acteurExterne: this.sdMaj?.acteurExterne?.guid,
      promoteurImmobilier: this.sdMaj?.promoteurImmobilier?.guid,
      typeOperation:this.sdMaj.typeOperation,
      commune:this.sdMaj.commune.id,
      arrondissement:this.sdMaj.arrondissement?.id,
      dossier: {
        objet: this.sdMaj.objet,
        dateExterne: this.sdMaj.dateExterne,
        etatDossier: this.sdMaj.etatDossier,
        refExterne: this.sdMaj.refExterne
      },
      contribuableBeneficiaire: this.sdMaj?.contribuableBeneficiaire?.guid,
      structureBeneficiaire: this.sdMaj?.structureBeneficiaire?.id,
      parcellesADesactive: this.sdMaj?.parcellesADesactive?.map(parcelle => parcelle?.id),
      ilotsADesactive: this.sdMaj?.ilotsADesactive?.map(ilot => ilot?.id),
      ilotsM: this.sdMaj?.ilotsAModifier?.map(ilot => ilot?.id),
      sectionsM: this.sdMaj?.sectionsAModifier?.map(ilot => ilot?.id),
      parcellesM: this.sdMaj?.parcellesAModifier.map(parcelle => parcelle?.id),
      ilotsAAjouter:this.sdMaj?.ilotsAAjouter.map(ilot => ilot?.id),
      ilotsAModifier:this.sdMaj?.ilotsAModifier.map(ilot => ilot?.id),
    });

    if (this.sdMaj.listPieces) {
      this.sdMaj.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }
    this.categoriePieceProcessus$ = this.transition?.categoriePieces;
  }
  updateArrondissement(value: number) {
    this.arrondissement.setValue(value);
  }
  public categoriePieceProcessus$: CategoriePieceProcessus[] = [];
  public idCategoriePieceListChosen$: number[] = [];
  public changeCategoriePiece(data: CategoriePieceProcessus) {
    this.idCategoriePieceListChosen$ = [];
    for (let i = 0; i < this.pieces.length; i++) {
      let piece = this.pieces.at(i);
      this.idCategoriePieceListChosen$.push(piece.value.categorie);
    }
    let that = this;
    this.categoriePieceProcessus$ = this.transition?.categoriePieces.filter((piece) => {
      return (that.idCategoriePieceListChosen$.indexOf(piece.id) < 0);
    });

  }
  addNewDossierPiece() {
    if (this.categoriePieceProcessus$.length > 0) {
      super.addNewDossierPiece();
    }
  }
  removeDossierPiece(i) {
    super.removeDossierPiece(i);
    this.changeCategoriePiece(null);
  }

  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }

    this.loadingEvent.emit(true);
    let { dossier, acteurExterne,typeOperation,commune,arrondissement,promoteurImmobilier, contribuableBeneficiaire, structureBeneficiaire,
       parcelles, pieces, ilots, parcellesAAjouter, parcellesADesactive,
       ilotsADesactive, parcellesAModifier, action, numero, ilotsAAjouter, ilotsAModifier } = this.formulaire.value;

    let tmp = { acteurExterne,typeOperation,commune,arrondissement,promoteurImmobilier,parcelles, contribuableBeneficiaire,
      structureBeneficiaire , pieces, ilots, parcellesAAjouter,
      parcellesADesactive, ilotsADesactive, parcellesAModifier, action, numero, ilotsAAjouter, ilotsAModifier };

    let dataPost = { ...dossier, ...tmp};
    this.sdMajService.executer(dataPost).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar("Dossier de mise a jour plan  modifié avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );

  }
  resetForm(){
      this.router.navigate([`${environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE}`]);

  }
  public onChangeCommune(commune: CommuneAutocomplete) {
    this.communeAuto = commune;
  }
}
