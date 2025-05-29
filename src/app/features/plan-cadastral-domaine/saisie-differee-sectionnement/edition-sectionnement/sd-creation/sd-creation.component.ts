import {Component, OnInit} from '@angular/core';
import {
  TransitionSdSectionnementComponent
} from "@sycadFeature/plan-cadastral-domaine/saisie-differee-sectionnement/edition-sectionnement/transition-sd-sectionnement.component";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  AppConfirmService
} from "@sycadShared/app-confirm/app-confirm.service";
import {DateAdapter} from "@angular/material/core";
import {
  MediaChange,
  MediaObserver
} from "@angular/flex-layout";
import {FormBuilder} from "@angular/forms";
import {
  CommunesService
} from "@sycadApp/services/data-references/territoire/communes.service";
import {
  CategoriePieceService
} from "@sycadApp/services/data-references/system/categorie-piece.service";
import {
  ActeursService
} from "@sycadApp/services/data-references/contribuables/acteurs.service";
import {
  ContribuableService
} from "@sycadApp/services/data-references/system/contribuable.service";
import {
  StructureService
} from "@sycadApp/services/data-references/organigramme/structure.service";
import {
  ParcelleService
} from "@sycadApp/services/cession-parcelle/parcelle.service";
import {
  MandatService
} from "@sycadApp/services/workflow/mandat.service";
import {
  CategoriePieceProcessus
} from "@sycadApp/models/workflow/common/general";
import {
  environment
} from "../../../../../../environments/environment";
import {SycadUtils} from "@sycadShared/utils.functions";
import {
  SdSectionnementService
} from "@sycadApp/services/workflow/common/sd-sectionnement.service";
import {
  SdSectionnementElement
} from "@sycadApp/models/workflow/sd-sectionnement.model";
import {
  CommuneAutocomplete
} from "@sycadApp/models/data-references/territoire/commune.model";

@Component({
  selector: 'app-sd-creation',
  templateUrl: './sd-creation.component.html',
  styleUrls: ['./sd-creation.component.scss']
})
export class SdCreationComponent extends  TransitionSdSectionnementComponent implements OnInit{

  communeAuto: CommuneAutocomplete;
  constructor(
    public dialog: MatDialog,
    public router: Router,
    public _snackBar: MatSnackBar,
    public confirmService: AppConfirmService,
    public _adapter: DateAdapter<any>,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public communeService: CommunesService,
    public categoriePieceService: CategoriePieceService,
    public sdSectionnementService: SdSectionnementService,
    public acteurService: ActeursService,
    public contribuableService: ContribuableService,
    public structureService: StructureService,
    public parcelleService: ParcelleService,
    public mandatService: MandatService
  ) {

    super(router, dialog, _snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, sdSectionnementService,
      acteurService, contribuableService, structureService, mandatService);

  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  ngOnInit(): void {

    this._adapter.setLocale("fr");
    this.sdSectionnementElement = new SdSectionnementElement();
    this.categoriePieceProcessus$ = this.processus?.categoriePieces;
    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.structureService);
    this.initConfigAutocompleteActeur();
    this.initConfigAutocompleteActeurPromoteur();
    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);


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
    let { dossier, acteurExterne,typeOperation,commune,promoteurImmobilier,  contribuableBeneficiaire,
      structureBeneficiaire , pieces, sectionsADesactive,
     sectionsAAjouter,sectionsAModifier} = this.formulaire.value;

    let tmp = {  acteurExterne,typeOperation,commune,promoteurImmobilier, contribuableBeneficiaire,
      structureBeneficiaire , pieces, sectionsADesactive,sectionsAAjouter,sectionsAModifier};

    let dataPost = { ...dossier, ...tmp};
    this.sdSectionnementService.creer(dataPost).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar("Dossier de saisie sectionnement ajouté avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_SECTIONNEMENT]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );

  }

  resetForm(){
    this.router.navigate([`${environment.FRONTEND_ROUTES.SAISIE_DIFFEREE_SECTIONNEMENT}`]);

  }

  public onChangeCommune(commune: CommuneAutocomplete) {
    this.communeAuto = commune;
  }
}
