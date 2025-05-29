import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@sycadShared/app-confirm/app-confirm.service';
import { DateAdapter } from '@angular/material/core';
import {
  MediaChange,
  MediaObserver
} from '@angular/flex-layout';
import { SycadUtils } from '@sycadShared/utils.functions';
import { CategoriePieceProcessus } from '@sycadApp/models/workflow/common/general';
import { TransitionAttributionComponent } from '../transition-sd-attribution.component';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';

import { ProfessionService } from '@sycadApp/services/data-references/system/profession.service';
import { CategoriePieceService } from '@sycadApp/services/data-references/system/categorie-piece.service';
import { SdAttributionService } from '@sycadApp/services/workflow/sd-attribution.service';
import { AttributionParcelle } from '@sycadApp/models/workflow/sd-attribution.model';
import { CessionSource, CessionSourceType } from '@sycadApp/models/workflow/common/attribution-source.model';
import { of, Subject } from 'rxjs';
import {
  IlotElement,
  ParcelleElement
} from '@sycadApp/models/data-references/territoire/localite.model';
import { CessionSourceService } from '@sycadApp/services/impot/cession-source.service';
import { ContribuableService } from '@sycadApp/services/data-references/system/contribuable.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { SaisieDiffereeAttributionContexteService } from '@sycadApp/services/workflow/saisie-differee-attribution-contexte.service';
import { SdEntetePVService } from '@sycadApp/services/workflow/sd-entetePV.service';
import { ArrondissementElement } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { SaisieDiffereeAttributionContexte, SaisieDiffereeAttributionContexteElement } from '@sycadApp/models/workflow/sd-saisie-differee-attribution-contexte.model';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import {
  DocumentTypeService
} from "@sycadApp/services/data-references/system/document-type.service";


@Component({
  selector: 'pc-creation-sd-attribution',
  templateUrl: './creation-sd-attribution.component.html',
  styleUrls: ['./creation-sd-attribution.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreationSdAttributionComponent extends TransitionAttributionComponent implements OnInit {



  public parcelleContextInit: ParcelleElement = new ParcelleElement();
  public attributionContexte: SaisieDiffereeAttributionContexteElement ;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public attributionService: SdAttributionService,
    public attributionSourceService: CessionSourceService,
    public saisieDiffereeAttributionContexteService:SaisieDiffereeAttributionContexteService,
    public entetePVService:SdEntetePVService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public professionService: ProfessionService,
    public categoriePieceService: CategoriePieceService,
    public communeService: CommunesService,
    public parcelleService: ParcelleService,
    public documentTypeService: DocumentTypeService
  ) {
    super(router, dialog,_snackBar, confirmService, _adapter, mediaObserver, fb, attributionService, attributionSourceService, acteurService, contribuableService, professionService, categoriePieceService,parcelleService,documentTypeService);

    this.attributionContexte = this.route.snapshot.data["contexteAttribution"];

  }


  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  ngOnInit(): void {
    this._adapter.setLocale("fr");

    this.attribution = new AttributionParcelle();

    this.cessionSourceRemoteAutocomplte.params.set("type", CessionSourceType.ATTRIBUTION);
    this.cessionSourceRemoteAutocomplte.initializeRemoteAutocompletion(this._onDestroy, this.attributionSourceService);
    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);

    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteAttributaire();

    this.typeDocuments=this.processus.typeDocuments;

    if(this.attributionContexte  ) {
      let arrondissement = new ArrondissementElement();

      let commune=this.attributionContexte.section.commune;
      arrondissement.commune=commune;
     this.parcelleContextInit.arrondissement=arrondissement;
     if(this.attributionContexte.ilot==null){
       let ilot = new IlotElement();
       ilot.section=this.attributionContexte.section;
       this.parcelleContextInit.ilot=ilot;
     }else{
       this.parcelleContextInit.ilot=this.attributionContexte?.ilot;
     }

    // console.log("lecture parcelleContextInit",this.parcelleContextInit);
     this.formulaire.patchValue({
      dossier: {
        observation: this.attributionContexte.entetePVAttributionDossier.observation,
      },
      parcelle: -99,
      cessionSource: this.attributionContexte.entetePVAttributionDossier?.cessionSource?.id,
       numeroDePage:this.attributionContexte.numeroPage,
       numeroDePV:this.attributionContexte.numeropv,
       documentType:this.attributionContexte.entetePVAttributionDossier.documentDeSortie.documentType,
       documentDeSortie:{
         id: this.attributionContexte.entetePVAttributionDossier.documentDeSortie?.id,
         numero: this.attributionContexte.entetePVAttributionDossier.documentDeSortie?.numero,
         libelle: this.attributionContexte.entetePVAttributionDossier.documentDeSortie?.libelle,
         pieceJointe: this.attributionContexte.entetePVAttributionDossier.documentDeSortie?.pieceJointe,
         documentType: this.attributionContexte.entetePVAttributionDossier.documentDeSortie?.documentType?.id,
         dateDoc: this.attributionContexte.entetePVAttributionDossier.documentDeSortie?.dateDoc
       }
    });

    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);


    }
  }

  onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchCategoriePiece(eventNgSelect) {
    this.categorieIdentiteRemoteAutocomplete.term.next(eventNgSelect.term);
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
    this.categoriePieceProcessus$ = this.processus.categoriePieces.filter((piece) => {
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
    let { dossier, acteur, cessionSource, attributaire, parcelle, pieces, documentDeSortie ,mandats, numeroDePage,numeroDePV, parcelleInexistante} = this.formulaire.value;

    let tmp = { acteur, cessionSource, parcelle, attributaire, pieces, documentDeSortie ,mandats, numeroDePage,numeroDePV, parcelleInexistante};
    let dataPost = { ...dossier, ...tmp };
    this.attributionService.creer(dataPost).subscribe(data => {
      this.loadingEvent.emit(false);
      SycadUtils.notifyRemoteInfo("Attribution ajoutée avec succès", this._snackBar);
      this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION]);
    },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );
  }

  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_ATTRIBUTION}`]);
  }

}
