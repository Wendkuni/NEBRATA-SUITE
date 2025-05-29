import {Component, OnInit} from '@angular/core';
import {
  FlexModule, MediaChange,
  MediaObserver
} from "@angular/flex-layout";
import {GenericsFormModule} from "@sycadShared/form-components/generic-form.module";
import {MatButtonModule} from "@angular/material/button";
import {MatStepperModule} from "@angular/material/stepper";
import {
  TransitionEntetePVComponent
} from "@sycadFeature/cession-parcelle-domaine/saisie-differee-pv-attribution/edition-saisie-attribution/transition-saisie-attribution.component";
import {
  RemoteAutocompleteArrondissementZoneCompetence,
  RemoteAutocompleteCommuneZoneCompetence
} from "@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence";
import {
  CommuneAutocomplete
} from "@sycadApp/models/data-references/territoire/commune.model";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {
  AppConfirmService
} from "@sycadShared/app-confirm/app-confirm.service";
import {DateAdapter} from "@angular/material/core";
import {FormBuilder, Validators} from "@angular/forms";
import {
  SdEntetePVService
} from "@sycadApp/services/workflow/sd-entetePV.service";
import {
  CategoriePieceService
} from "@sycadApp/services/data-references/system/categorie-piece.service";
import {
  CommunesService
} from "@sycadApp/services/data-references/territoire/communes.service";
import {
  DocumentTypeService
} from "@sycadApp/services/data-references/system/document-type.service";
import {
  CessionSourceService
} from "@sycadApp/services/impot/cession-source.service";
import {
  ArrondissementsService
} from "@sycadApp/services/data-references/territoire/arrondissements.service";
import {
  ArrondissementAutocomplete
} from "@sycadApp/models/data-references/territoire/arrondissement.model";
import {
  CessionSourceType
} from "@sycadApp/models/workflow/common/attribution-source.model";
import {of} from "rxjs";
import {
  CategoriePieceProcessus
} from "@sycadApp/models/workflow/common/general";
import {SycadUtils} from "@sycadShared/utils.functions";
import {
  environment
} from "../../../../../../environments/environment";

@Component({
  selector: 'app-archivage-pvattribution',
  templateUrl: './archivage-pvattribution.component.html',
  styleUrls: ['./archivage-pvattribution.component.scss']
})
export class ArchivagePVAttributionComponent extends TransitionEntetePVComponent implements OnInit {



  public communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();
  estEditable=false;
  constructor(public router: Router,
              public _snackBar: MatSnackBar,
              public dialog: MatDialog,
              public confirmService: AppConfirmService,
              public _adapter: DateAdapter<any>,
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public entetePVService: SdEntetePVService,
              public categoriePieceService: CategoriePieceService,
              public communeService: CommunesService,
              public documentTypeService: DocumentTypeService,
              public attributionSourceService: CessionSourceService,
              public arrondissementService: ArrondissementsService,
  ) {
    super(router,_snackBar, confirmService, _adapter, mediaObserver, fb, entetePVService, categoriePieceService, communeService,documentTypeService,  attributionSourceService,arrondissementService);

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

    this.typeDocuments=this.processus.typeDocuments;
    this.arrondissementRemoteAutocomplete= new RemoteAutocompleteArrondissementZoneCompetence<ArrondissementAutocomplete>();
    this.categorieIdentiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.categoriePieceService);
    this.cessionSourceRemoteAutocomplte.params.set("type", CessionSourceType.ATTRIBUTION);
    this.cessionSourceRemoteAutocomplte.initializeRemoteAutocompletion(this._onDestroy, this.attributionSourceService);
    this.documentTypeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.documentTypeService);
    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    //
    // console.log(this.typeDocuments);

    if (this.entetePV.cessionSource) {
      this.cessionSourceRemoteAutocomplte.listRessource$ = of([this.entetePV.cessionSource]);
      this.cessionSourceRemoteAutocomplte.initialList = [this.entetePV.cessionSource];
    }

    // if (this.entetePV.documentDeSortie) {
    //   this.documentTypeRemoteAutocomplete.listRessource$ = of([this.entetePV.documentDeSortie.documentType]);
    //   this.documentTypeRemoteAutocomplete.initialList = [this.entetePV.documentDeSortie.documentType];
    // }


    this.formulaire.patchValue({
      numero: this.entetePV.numero,
      action: this.transition.code,
      documentDeSortie:{
        id: this.entetePV.documentDeSortie?.id,
        numero: this.entetePV.documentDeSortie?.numero,
        libelle: this.entetePV.documentDeSortie?.libelle,
        pieceJointe: this.entetePV.documentDeSortie?.pieceJointe,
        documentType: this.entetePV.documentDeSortie?.documentType?.id,
        dateDoc: this.entetePV.documentDeSortie?.dateDoc
      }
    });

  }


  public categoriePieceProcessus$: CategoriePieceProcessus[] = [];
  public idCategoriePieceListChosen$: number[] = [];
  public changeCategoriePiece(data: CategoriePieceProcessus) {
    /*
        this.idCategoriePieceListChosen$ = [];
        for (let i = 0; i < this.pieces.length; i++) {
          let piece = this.pieces.at(i);
          this.idCategoriePieceListChosen$.push(piece.value.categorie);
        }
        let that = this;
        this.categoriePieceProcessus$ = this.transition.categoriePieces.filter((piece) => {
          return (that.idCategoriePieceListChosen$.indexOf(piece.id) < 0);
        });
      */
  }

  public onSearchCategoriePiece(eventNgSelect) {
    this.categorieIdentiteRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  addNewDossierPiece() {
    //if (this.categoriePieceProcessus$.length > 0) {
    super.addNewDossierPiece();
    //}
  }

  removeDossierPiece(i) {
    super.removeDossierPiece(i);
    this.changeCategoriePiece(null);
  }




  onSubmit() {



    this.loadingEvent.emit(true);
    let { numero, action, documentDeSortie } = this.formulaire.value;

    let tmp = { numero, action, documentDeSortie };

    this.entetePVService.executer(tmp).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar("Archivage effectuée avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_PV_ATTRIBUTION]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );


  }
  resetForm() {
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_PV_ATTRIBUTION}`]);
  }

}
