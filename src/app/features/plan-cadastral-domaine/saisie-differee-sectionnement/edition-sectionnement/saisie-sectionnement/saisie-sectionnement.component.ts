import {Component, OnInit} from '@angular/core';
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
import {FormBuilder, Validators} from "@angular/forms";
import {
  CategoriePieceService
} from "@sycadApp/services/data-references/system/categorie-piece.service";
import {
  CommunesService
} from "@sycadApp/services/data-references/territoire/communes.service";
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
  MandatService
} from "@sycadApp/services/workflow/mandat.service";
import {
  ActeurAutocomplete
} from "@sycadApp/models/data-references/contribuables/acteur.model";
import {of} from "rxjs";
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
  TransitionSdSectionnementComponent
} from "@sycadFeature/plan-cadastral-domaine/saisie-differee-sectionnement/edition-sectionnement/transition-sd-sectionnement.component";
import {
  CommuneAutocomplete
} from "@sycadApp/models/data-references/territoire/commune.model";

@Component({
  selector: 'app-saisie-sectionnement',
  templateUrl: './saisie-sectionnement.component.html',
  styleUrls: ['./saisie-sectionnement.component.scss']
})
export class SaisieSectionnementComponent extends TransitionSdSectionnementComponent implements OnInit{

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
              public sdSectionnementService: SdSectionnementService,
              public contribuableService: ContribuableService,
              public acteurService: ActeursService,
              public structureService: StructureService,
              public mandatService: MandatService)
  {
    super(router, dialog, _snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, sdSectionnementService,
      acteurService,contribuableService, structureService, mandatService);
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
    if (this.sdSectionnementElement.acteurExterne) {
      let acteurEl: ActeurAutocomplete = new ActeurAutocomplete();

      acteurEl.denomination = this.sdSectionnementElement.acteurExterne.denomination;
      acteurEl.guid = this.sdSectionnementElement.acteurExterne.guid;
      acteurEl.statusJuridique = this.sdSectionnementElement.acteurExterne.statusJuridique.libelle;
      acteurEl.sigle = this.sdSectionnementElement.acteurExterne.sigle;
      acteurEl.username = this.sdSectionnementElement.acteurExterne.username;
      acteurEl.categorie = this.sdSectionnementElement.acteurExterne?.categorie?.libelle;

      this.acteurRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([acteurEl]);
      this.acteurRemoteAutocomplete.initialList = [acteurEl];
    }
    if (this.sdSectionnementElement.promoteurImmobilier) {
      let acteurEl: ActeurAutocomplete = new ActeurAutocomplete();

      acteurEl.denomination = this.sdSectionnementElement.promoteurImmobilier.denomination;
      acteurEl.guid = this.sdSectionnementElement.promoteurImmobilier.guid;
      acteurEl.statusJuridique = this.sdSectionnementElement.promoteurImmobilier.statusJuridique.libelle;
      acteurEl.sigle = this.sdSectionnementElement.promoteurImmobilier.sigle;
      acteurEl.username = this.sdSectionnementElement.promoteurImmobilier.username;
      acteurEl.categorie = this.sdSectionnementElement.promoteurImmobilier?.categorie?.libelle;

      this.acteurBeneficiaireRemoteAutocomplete.customNgSelectConfig.listRessource$ = of([acteurEl]);
      this.acteurBeneficiaireRemoteAutocomplete.initialList = [acteurEl];
    }
    this.sectionsChoisies = this.sdSectionnementElement.sectionsADesactive;

    this.sectionsAjoutes=this.sdSectionnementElement.sectionsAAjouter;
    this.sectionsModifies=this.sdSectionnementElement.sectionsAModifier;

    this.communeRemoteAutocomplete.listRessource$ = of([this.sdSectionnementElement.commune]);
    this.communeRemoteAutocomplete.initialList = [this.sdSectionnementElement.commune];
    this.communeAuto = this.sdSectionnementElement.commune;

    this.formulaire.patchValue({
      numero: this.sdSectionnementElement.numero,
      action: this.transition.code,
      acteurExterne: this.sdSectionnementElement?.acteurExterne?.guid,
      promoteurImmobilier: this.sdSectionnementElement?.promoteurImmobilier?.guid,
      typeOperation:this.sdSectionnementElement.typeOperation,
      commune:this.sdSectionnementElement.commune.id,
      dossier: {
        objet: this.sdSectionnementElement.objet,
        dateExterne: this.sdSectionnementElement.dateExterne,
        etatDossier: this.sdSectionnementElement.etatDossier,
        refExterne: this.sdSectionnementElement.refExterne
      },
      sectionsADesactive: this.sdSectionnementElement?.sectionsADesactive?.map(section => section?.id),

      sectionsM: this.sdSectionnementElement?.sectionsAModifier?.map(ilot => ilot?.id),
      sectionsAAjouter:this.sdSectionnementElement?.sectionsAAjouter.map(section => section?.id),
      sectionsAModifier:this.sdSectionnementElement?.sectionsAModifier.map(section => section?.id),
    });

    if (this.sdSectionnementElement.listPieces) {
      this.sdSectionnementElement.listPieces.map((piece) => {
        this.pieces.insert(0, this.createDossierPiece(piece));
      });
    }
    this.categoriePieceProcessus$ = this.transition?.categoriePieces;
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
    let { dossier, acteurExterne,typeOperation,commune,promoteurImmobilier, contribuableBeneficiaire, pieces, sectionsADesactive,
      action, numero,sectionsAAjouter, sectionsAModifier } = this.formulaire.value;

    let tmp = { acteurExterne,typeOperation,commune,promoteurImmobilier, contribuableBeneficiaire
     , pieces,  sectionsADesactive, action, numero,
      sectionsAAjouter, sectionsAModifier };

    let dataPost = { ...dossier, ...tmp};
    this.sdSectionnementService.executer(dataPost).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar("Dossier de saisie sectionnement  modifié avec succès", "OK");
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
