import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadShared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { SycadUtils } from '@sycadShared/utils.functions';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';
import { environment } from 'environments/environment';
import { ActeurAutocomplete } from '@sycadApp/models/data-references/contribuables/acteur.model';
import { CessionSource, CessionSourceType } from '@sycadApp/models/workflow/common/attribution-source.model';
import { of, Subject } from 'rxjs';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';

import { SdMutationService } from '@sycadApp/services/workflow/sd-mutation.service';
import { MatDialog } from '@angular/material/dialog';
import { TransitionSdMutationComponent } from '../transition-sd-mutation.component';
import { EtatAttribution } from '@sycadApp/models/data-references/contribuables/global.model';

@Component({
  selector: 'pc-saisie-sd-mutation',
  templateUrl: './saisie-sd-mutation.component.html',
  styleUrls: ['./saisie-sd-mutation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieSdMutationComponent extends TransitionSdMutationComponent implements OnInit {

  constructor(   public dialog: MatDialog,public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public mutationService: SdMutationService,
    public arrondissementsService: ArrondissementsService,
    public attributionSourceService: CessionSourceService,
    public parcelleService: ParcelleService,
    public communeService: CommunesService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService
  ) {
    super(dialog,router, _snackBar, confirmService, _adapter, mediaObserver, fb, mutationService, attributionSourceService, parcelleService, communeService, acteurService, contribuableService, professionService, categoriePieceService);



    this.formulaire.addControl("action", this.fb.control(null, [Validators.required]));
    this.formulaire.addControl("numero", this.fb.control(null, [Validators.required]));

  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");




    this.categorieIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categoriePieceService);


    this.cessionSourceRemoteAutocomplte.params.set("type", CessionSourceType.MUTATION);
    this.cessionSourceRemoteAutocomplte.initializeRemoteAutocompletion(this._onDestroy, this.attributionSourceService);
    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteCedant();
    this.initConfigAutocompleteCessionnaire();


    this.cessionnaireChoisie=this.mutation.cessionnaire;
    this.cedantChoisie=this.mutation.cedant;

    if (this.mutation.acteur) {
      let acteurEl: ActeurAutocomplete = new ActeurAutocomplete();

      acteurEl.denomination = this.mutation.acteur.denomination;
      acteurEl.guid = this.mutation.acteur.guid;
      acteurEl.statusJuridique = this.mutation.acteur.statusJuridique.libelle;
      acteurEl.sigle = this.mutation.acteur.sigle;
      acteurEl.username = this.mutation.acteur.username;
      acteurEl.categorie = this.mutation.acteur?.categorie?.libelle;

      this.acteurRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([acteurEl]);
      this.acteurRemoteAutocomplete.initialList = [acteurEl];
    }
    if(this.mutation.cessionnaire){
    this.cessionnaireRemoteAutocomplete.customNgSelectConfig.listRessource$=of([this.mutation.cessionnaire]);
    this.cessionnaireRemoteAutocomplete.initialList=[this.mutation.cessionnaire];
    }
    if(this.mutation.cedant){
      this.cedantRemoteAutocomplete.customNgSelectConfig.listRessource$=of([this.mutation.cedant]);
      this.cedantRemoteAutocomplete.initialList=[this.mutation.cedant];

      this.receiveSubjectCedant(this.mutation.cedant);
    }
    if(this.mutation.cessionnaire){
      this.cessionnaireRemoteAutocomplete.customNgSelectConfig.listRessource$=of([this.mutation.cessionnaire]);
      this.cessionnaireRemoteAutocomplete.initialList=[this.mutation.cessionnaire];

    }
    if (this.mutation.cessionSource) {
      this.cessionSourceRemoteAutocomplte.listRessource$ = of([this.mutation.cessionSource]);
      this.cessionSourceRemoteAutocomplte.initialList = [this.mutation.cessionSource];
    }
    if(this.mutation.mandats){
      this.mutation.mandats.map((mandat) => {
        this.mandats.insert(0, this.createMandat(mandat));
      });
    }

    if (this.mutation.parcelle) {


      if(this.mutation.parcelle.etatAttribution===EtatAttribution.LIBRE) {
        this.isParcelleLibreEnable=true;
      }

      
      //this.sectionChoisie=this.attribution.parcelle.ilot.section;
      this.mutation.parcelle.arrondissement.commune=this.mutation.parcelle.ilot.section.commune;
   //   this.onChangeArrondissement(this.mutation.parcelle.arrondissement);
      //// console.log("this.parcelleChoisie",this.parcelleChoisie);
      //// console.log("this.sectionChoisie",this.sectionChoisie);
    }
    if (this.mutation.listPieces) {
      this.mutation.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }
    if(this.mutation.documents){
      this.mutation.documents.map((document)=>{
        this.documents.insert(0, this.createDocument(document));
      });
    }
    this.categoriePieceProcessus$ = this.transition.categoriePieces;


  //  this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementsService);


    this.formulaire.patchValue({
      numero: this.mutation.numero,
      action: this.transition.code,
      dossier: {
        objet: this.mutation.objet,
        dateExterne: this.mutation.dateExterne,
        etatDossier: this.mutation.etatDossier,
        refExterne: this.mutation.refExterne
      },
      acteur: this.mutation.acteur?.guid,
      cessionSource: this.mutation.cessionSource?.id,
      parcelle: this.mutation?.parcelle?.id,
      cessionnaire: this.mutation.cessionnaire?.guid,
      cedant: this.mutation.cedant?.guid,
      valeurDeclare: this.mutation.valeurDeclare,
      bordereau: this.mutation.bordereau,
      folio: this.mutation.folio,
      caseDoc: this.mutation.caseDoc,
      numeroQuittance: this.mutation.numeroQuittance,
      droit: this.mutation.droit,
      dateQuittance: this.mutation.dateQuittance,
      enregistrement: this.mutation.enregistrement,
      mandats: []
    });
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
    this.categoriePieceProcessus$ = this.transition.categoriePieces.filter((piece) => {
      return (that.idCategoriePieceListChosen$.indexOf(piece.id) < 0);
    });

  }

  public onSearchCategoriePiece(eventNgSelect) {
    this.categorieIdentiteRemoteAutocomplete.term.next(eventNgSelect.term);
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
    let { dossier, acteur, cessionSource,cessionnaire, cedant, valeurDeclare, droit, enregistrement,
      bordereau, folio, caseDoc, numeroQuittance, dateQuittance, parcelle, pieces, documents, numero,
      action,mandats } = this.formulaire.value;

    let tmp = { acteur, cessionSource, parcelle, cessionnaire, cedant, valeurDeclare, droit, enregistrement,
      bordereau, folio, caseDoc, numeroQuittance, dateQuittance, pieces, documents, action, numero,mandats };
    let dataPost = { ...dossier, ...tmp };

    this.attributionService.executer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      this.openSnackBar("Mutation modifiée avec succès", "OK");
      this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MUTATION]);
    },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }
  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_MUTATION}`]);
  }

}
