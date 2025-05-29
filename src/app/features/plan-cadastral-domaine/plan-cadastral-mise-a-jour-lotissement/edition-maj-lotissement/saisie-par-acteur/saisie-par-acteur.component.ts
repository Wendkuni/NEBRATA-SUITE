import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {TransitionPlanCadastralMiseAJourLotissementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-mise-a-jour-lotissement/edition-maj-lotissement/transition-maj-lotissement.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {FormBuilder, Validators} from '@angular/forms';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {PlanCadastralMiseAjourLotissementService} from '@sycadApp/services/workflow/common/maj-lotissement.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {catchError, map, of} from 'rxjs';
import {CategoriePieceProcessus, Mandat} from '@sycadApp/models/workflow/common/general';
import {AuthentificatedUser} from '@sycadApp/features/transverse/login/auth.user';
import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';
import { RemoteAutocompleteExtend } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';

@Component({
  selector: 'app-saisie-maj-lotissement-par-acteur',
  templateUrl: './saisie-par-acteur.component.html',
  styleUrls: ['./saisie-par-acteur.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaisieParActeurComponent  extends  TransitionPlanCadastralMiseAJourLotissementComponent implements OnInit {

  @Input('authentificatedUser')
  public authentificatedUser: AuthentificatedUser;

  public guidProprietaire: string;

  public communeRemoteAutocomplete = new RemoteAutocompleteExtend<CommuneAutocomplete>();


  constructor(public dialog: MatDialog,
              public router: Router,
              public _snackBar: MatSnackBar,
              public confirmService: AppConfirmService,
              public _adapter: DateAdapter<any>,
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public communeService: CommunesService,
              public categoriePieceService: CategoriePieceService,
              public majLotissmentService: PlanCadastralMiseAjourLotissementService,
              public acteurService: ActeursService,
              public contribuableService: ContribuableService,
              public structureService: StructureService,
              public parcelleService: ParcelleService,
              public mandatService: MandatService) {
    super(router, dialog, _snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, majLotissmentService,
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


    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
    this.communeRemoteAutocomplete.callbackAutocomplete= (search:string,params:Map<string,any>)=> {
      return this.communeService.autocompletion(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };


    this.sectionsChoisies = this.majLotissement.sectionsADesactive;
    this.sectionsAAjouterChoisies = this.majLotissement?.sectionsAAjouter;
    this.sectionsAModifierChoisies = this.majLotissement?.sectionsAModifier;

    this.ilotsChoisies = this.majLotissement.ilotsADesactive;
    this.ilotsChoisiesAajouter = this.majLotissement.ilotsAAjouter;
    this.ilotsChoisiesAModifier = this.majLotissement.ilotsAModifier;

    this.parcellesChoisies = this.majLotissement.parcellesADesactive;
    this.newParcelles = this.majLotissement.parcellesAAjouter;
    this.editParcelles = this.majLotissement.parcellesAModifier;

    this.communeRemoteAutocomplete.listRessource$ = of([this.majLotissement.commune]);
    this.communeRemoteAutocomplete.initialList = [this.majLotissement.commune];

    this.formulaire.patchValue({
      numero: this.majLotissement.numero,
      action: this.transition.code,
      mandat: this.majLotissement?.mandats[0]?.id,
      typeOperation:this.majLotissement.typeOperation,
      commune:this.majLotissement.commune.id,
      dossier: {
        objet: this.majLotissement.objet,
        dateExterne: this.majLotissement.dateExterne,
        etatDossier: this.majLotissement.etatDossier,
        refExterne: this.majLotissement.refExterne
      },
      parcellesADesactive: this.majLotissement?.parcellesADesactive?.map(parcelle => parcelle?.id),
      sectionsADesactive: this.majLotissement?.sectionsADesactive?.map(section => section?.id),
      ilotsADesactive: this.majLotissement?.ilotsADesactive?.map(ilot => ilot?.id),
      parcellesM: this.majLotissement?.parcellesAModifier?.map(parcelle => parcelle?.id),
      sectionsM: this.majLotissement?.sectionsADesactive?.map(section => section?.id),
      ilotsM: this.majLotissement?.ilotsADesactive?.map(ilot => ilot?.id),
      sectionsAAjouter: this.majLotissement?.sectionsAAjouter?.map(section => section?.id),
      sectionsAModifier: this.majLotissement?.sectionsAModifier?.map(section => section?.id),
      ilotsAAjouter: this.majLotissement?.ilotsAAjouter?.map(ilot => ilot?.id),
      ilotsAModifier: this.majLotissement?.ilotsAModifier?.map(ilot => ilot?.id)
    });

  }

  public onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
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

  receiveSubjectMandat(mandat: Mandat) {
    this.mandatChoisie = mandat;
    if (mandat) {
      this.contribuableBeneficiaireChoisie = mandat.mandant;
      this.guidProprietaire = mandat.mandant.guid;
    }else {
      this.contribuableBeneficiaireChoisie = null;
      this.guidProprietaire = this.authentificatedUser.guid;

    }
    this.parcellesChoisies = null;
    this.parcellesAAjouter.setValue(null);
  }

  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
    


    this.loadingEvent.emit(true);

    let { dossier,typeOperation, commune, contribuableBeneficiaire, structureBeneficiaire , parcelles, pieces, ilots,
      parcellesAAjouter, sectionsADesactive, parcellesADesactive, ilotsADesactive, parcellesAModifier, action, numero,
      sectionsAAjouter,sectionsAModifier, ilotsAAjouter,ilotsAModifier} = this.formulaire.value;
    let tmp = {typeOperation, commune, parcelles,contribuableBeneficiaire, structureBeneficiaire , pieces, ilots,
      parcellesAAjouter, sectionsADesactive, parcellesADesactive, ilotsADesactive, parcellesAModifier, action, numero,
      sectionsAAjouter,sectionsAModifier, ilotsAAjouter,ilotsAModifier};
    let dataPost = { ...dossier, ...tmp};
    this.majLotissmentService.executer(dataPost).subscribe(data => {
        this.loadingEvent.emit(false);
        this.openSnackBar("Dossier de mise à jour plan  modifié avec succès", "OK");
        this.router.navigate([environment.FRONTEND_ROUTES.PROCESSUS_PLAN_CADASTRAL_MAJ_PLAN_CADASTRE]);
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    );

  }

}
