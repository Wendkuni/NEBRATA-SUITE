import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TransitionPlanCadastralMiseAJourLotissementComponent} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-mise-a-jour-lotissement/edition-maj-lotissement/transition-maj-lotissement.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfirmService} from '@sycadShared/app-confirm/app-confirm.service';
import {DateAdapter} from '@angular/material/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {CategoriePieceService} from '@sycadApp/services/data-references/system/categorie-piece.service';
import {PlanCadastralMiseAjourLotissementService} from '@sycadApp/services/workflow/common/maj-lotissement.service';
import {ActeursService} from '@sycadApp/services/data-references/contribuables/acteurs.service';
import {ContribuableService} from '@sycadApp/services/data-references/system/contribuable.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {MandatService} from '@sycadApp/services/workflow/mandat.service';
import {environment} from '../../../../../../environments/environment';
import {SycadUtils} from '@sycadShared/utils.functions';
import {MatTableDataSource} from '@angular/material/table';
import {IlotElement, LocaliteAutocomplete, ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';
import {Section} from '@sycadApp/models/data-references/contribuables/global.model';
import {BehaviorSubject, of} from 'rxjs';
import { AbstractControl } from '@angular/forms';
import {CommunesService} from '@sycadApp/services/data-references/territoire/communes.service';
import {RemoteAutocomplete} from '@sycadShared/form-components/model/remote-autocomplete';
import {CommuneAutocomplete} from '@sycadApp/models/data-references/territoire/commune.model';
import {
  RemoteAutocompleteArrondissementZoneCompetence,
  RemoteAutocompleteCommuneZoneCompetence
} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import {SectionService} from '@sycadApp/services/cession-parcelle/section.service';
import {DestinationParcelle} from '@sycadApp/models/bornage/destinationParcelle.model';
import {DestinationParcelleService} from '@sycadApp/services/bornage/destination-parcelle.service';
import {Quartier} from '@sycadApp/models/data-references/territoire/quartier.model';
import {LocaliteService} from '@sycadApp/services/data-references/territoire/localite.service';
import {QuartierService} from '@sycadApp/services/data-references/territoire/quartier.service';
import {ArrondissementsService} from '@sycadApp/services/data-references/territoire/arrondissements.service';
import {ArrondissementAutocomplete} from '@sycadApp/models/data-references/territoire/arrondissement.model';
import {IlotService} from '@sycadApp/services/cession-parcelle/ilot.service';

@Component({
  selector: 'app-mise-ajour-plan',
  templateUrl: './mise-ajour-plan.component.html',
  styleUrls: ['./mise-ajour-plan.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MiseAJourPlanComponent extends TransitionPlanCadastralMiseAJourLotissementComponent implements OnInit {

  public displayedColumns: string[] = ['numero', 'numeroAncien', 'libelle', 'superficie', 'destination', 'arrondissement', 'localite'];
  public displayedColumnsAjouter: string[] = ['ilot', 'numeroAncien', 'libelle', 'superficie', 'destination', 'arrondissement', 'localite', 'quartier', 'zone'];
  public displayedColumnsModifier: string[] = ['numero', 'numeroAncien', 'libelle', 'superficie', 'destination', 'arrondissement', 'localite', 'quartier', 'zone'];
  public displayedColumnsSection: string[] = ['commune', 'numero', 'numeroAncien'];
  public displayedColumnsSectionAjouter: string[] = ['commune', 'numeroAncien'];
  public displayedColumnsIlot: string[] = ['numero', 'numeroAncien'];
  public displayedColumnsIlotAjouter: string[] = ['numeroAncien', 'section'];

  public dataSourceParcellesADesactiver = new MatTableDataSource<ParcelleElement>();
  public dataSourceParcelleAAjoute = new BehaviorSubject<AbstractControl[]>([]);
  public dataSourceParcelleModifie = new BehaviorSubject<AbstractControl[]>([]);
  public dataSourceSectioneModifie = new BehaviorSubject<AbstractControl[]>([]);
  public dataSourceSectionAjoute = new BehaviorSubject<AbstractControl[]>([]);
  public dataSourceIlotModifie = new BehaviorSubject<AbstractControl[]>([]);
  public dataSourceIlotAjoute = new BehaviorSubject<AbstractControl[]>([]);
  public dataSourceSectionsADesactiver = new MatTableDataSource<Section>();
  public dataSourceIlotADesactiver = new MatTableDataSource<IlotElement>();
  public communeRemoteAutocomplete = new RemoteAutocomplete<CommuneAutocomplete>();
  public sectionRemoteAutocomplete = new RemoteAutocomplete<Section>();

  public ilotRemoteAutocomplete = new RemoteAutocomplete<IlotElement>();

  public destinationRemoteAutocomplete = new RemoteAutocomplete<DestinationParcelle>();
  public quartierRemoteAutocomplete = new RemoteAutocomplete<Quartier>();
  public localiteRemoteAutocomplete = new RemoteAutocomplete<LocaliteAutocomplete>();
  public arrondissementRemoteAutocomplete = new RemoteAutocomplete<ArrondissementAutocomplete>();

  public destinationRemoteAutocompleteAdd = new RemoteAutocomplete<DestinationParcelle>();
  public quartierRemoteAutocompleteAdd = new RemoteAutocomplete<Quartier>();
  public localiteRemoteAutocompleteAdd = new RemoteAutocomplete<LocaliteAutocomplete>();
  public arrondissementRemoteAutocompleteAdd = new RemoteAutocomplete<ArrondissementAutocomplete>();

  groupByFnArrondissement = (item) => item.commune.nom;
  groupValueFnArrondissement = (_: string, communes: any[]) => ({ name: communes[0].commune.nom, total: communes.length });

  
  constructor(public dialog: MatDialog,
              public router: Router,
              public _snackBar: MatSnackBar,
              public confirmService: AppConfirmService,
              public _adapter: DateAdapter<any>,
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public categoriePieceService: CategoriePieceService,
              public majLotissmentService: PlanCadastralMiseAjourLotissementService,
              public acteurService: ActeursService,
              public contribuableService: ContribuableService,
              public structureService: StructureService,
              public parcelleService: ParcelleService,
              public mandatService: MandatService,
              public communeService: CommunesService,
              public sectionService: SectionService,
              public localiteService: LocaliteService,
              public destinationParcelleService: DestinationParcelleService,
              public quartierService: QuartierService,
              public arrondissementService: ArrondissementsService,
              public ilotService: IlotService)
  {
    super(router, dialog, _snackBar, confirmService, _adapter, mediaObserver, fb, categoriePieceService, majLotissmentService,
      acteurService, contribuableService, structureService, parcelleService, mandatService);

    this.formulaire = this.fb.group({
      numero: [null, [Validators.required]],
      action: [null, [Validators.required]],
      parcellesAAjouter: new FormArray([]),
      parcellesAModifier: new FormArray([]),
      sectionsAModifier: new FormArray([]),
      sectionsAAjouter: new FormArray([]),
      ilotsAModifier: new FormArray([]),
      ilotsAAjouter: new FormArray([])

    });


  }
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  ngOnInit(): void {
    this._adapter.setLocale('fr');
    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementService);
    this.arrondissementRemoteAutocompleteAdd.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementService);

    this.destinationRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.destinationParcelleService);
    this.quartierRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.quartierService);
    this.localiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.localiteService);

    this.destinationRemoteAutocompleteAdd.initializeRemoteAutocompletion(this._onDestroy, this.destinationParcelleService);
    this.quartierRemoteAutocompleteAdd.initializeRemoteAutocompletion(this._onDestroy, this.quartierService);
    this.localiteRemoteAutocompleteAdd.initializeRemoteAutocompletion(this._onDestroy, this.localiteService);

    this.sectionsChoisies = this.majLotissement.sectionsADesactive;
    this.sectionsAAjouterChoisies = this.majLotissement?.sectionsAAjouter;
    this.sectionsAModifierChoisies = this.majLotissement?.sectionsAModifier;

    this.ilotsChoisies = this.majLotissement.ilotsADesactive;
    this.ilotsChoisiesAajouter = this.majLotissement.ilotsAAjouter;
    this.ilotsChoisiesAModifier = this.majLotissement.ilotsAModifier;

    this.parcellesChoisies = this.majLotissement.parcellesADesactive;
    this.newParcelles = this.majLotissement.parcellesAAjouter;
    this.editParcelles = this.majLotissement.parcellesAModifier;

    if (this.parcellesChoisies.length > 0) {
      this.dataSourceParcellesADesactiver.data = this.parcellesChoisies;
    }

    if (this.ilotsChoisies.length > 0) {
      this.dataSourceIlotADesactiver.data = this.ilotsChoisies;
    }

    if (this.ilotsChoisiesAModifier.length > 0) {
      this.ilotsChoisiesAModifier.map((ilot) => {
        this.ilotsAModifier.insert(0, this.listIlotsModifier(ilot));
        this.dataSourceIlotModifie.next(this.ilotsAModifier.controls);
      });
    }

    if (this.ilotsChoisiesAajouter.length > 0) {
      this.initSection();
      this.ilotsChoisiesAajouter.map((ilot) => {
        this.sectionRemoteAutocomplete.listRessource$ = of([ilot?.section]);
        this.sectionRemoteAutocomplete.initialList = [ ilot?.section];
        this.sectionRemoteAutocomplete.params.set("commune", ilot?.section?.commune?.id);
        this.sectionRemoteAutocomplete.term.next("");
        this.ilotsAAjouter.insert(0, this.listIlotsAjouter(ilot));
        this.dataSourceIlotAjoute.next(this.ilotsAAjouter.controls);
      });
    }

    if (this.sectionsChoisies.length > 0) {
      this.dataSourceSectionsADesactiver.data = this.sectionsChoisies;
    }

    if (this.sectionsAModifierChoisies.length > 0) {
      this.sectionsAModifierChoisies.map((section) => {
        this.sectionsAModifier.insert(0, this.listSectionsModifier(section));
        this.dataSourceSectioneModifie.next(this.sectionsAModifier.controls);
      });
    }

    if (this.sectionsAAjouterChoisies.length > 0) {
      this.sectionsAAjouterChoisies.map((section) => {
        this.communeRemoteAutocomplete.listRessource$ = of([ section?.commune]);
        this.communeRemoteAutocomplete.initialList = [ section?.commune];
        this.sectionsAAjouter.insert(0, this.listSectionsAjouter(section));
        this.dataSourceSectionAjoute.next(this.sectionsAAjouter.controls);
      });
    }


    if (this.editParcelles.length > 0) {
      this.editParcelles.map((parcelle) => {

        this.destinationRemoteAutocompleteAdd.listRessource$ = of([parcelle?.destination]);
        this.destinationRemoteAutocompleteAdd.initialList = [parcelle?.destination];

        if (parcelle.quartier) {
          this.quartierRemoteAutocompleteAdd.listRessource$ = of([parcelle.quartier]);
          this.quartierRemoteAutocompleteAdd.initialList = [parcelle.quartier];
        }

        this.localiteRemoteAutocompleteAdd.listRessource$ = of([parcelle?.localite]);
        this.localiteRemoteAutocompleteAdd.initialList = [parcelle?.localite];

        this.arrondissementRemoteAutocompleteAdd.params.set("commune", parcelle?.arrondissement?.commune?.id);
        this.arrondissementRemoteAutocompleteAdd.listRessource$ = of([parcelle?.arrondissement]);
        this.arrondissementRemoteAutocompleteAdd.initialList = [parcelle?.arrondissement];
        this.parcellesAModifier.insert(0, this.listParcellesModifier(parcelle));
        this.dataSourceParcelleModifie.next(this.parcellesAModifier.controls);

      });
    }

    if (this.newParcelles.length > 0) {
      this.initIlot();
      this.newParcelles.map((parcelle) => {
        this.ilotRemoteAutocomplete.listRessource$ = of([ parcelle?.ilot]);
        this.ilotRemoteAutocomplete.initialList = [ parcelle?.ilot];
        this.ilotRemoteAutocomplete.params.set("section", parcelle?.ilot?.section.id);
        this.ilotRemoteAutocomplete.term.next("");

        this.destinationRemoteAutocomplete.listRessource$ = of([parcelle?.destination]);
        this.destinationRemoteAutocomplete.initialList = [parcelle?.destination];

        this.localiteRemoteAutocomplete.listRessource$ = of([parcelle?.localite]);
        this.localiteRemoteAutocomplete.initialList = [parcelle?.localite];

        if (parcelle.quartier) {
          this.quartierRemoteAutocomplete.listRessource$ = of([parcelle.quartier]);
          this.quartierRemoteAutocomplete.initialList = [parcelle.quartier];
        }

        this.arrondissementRemoteAutocomplete.params.set("commune", parcelle?.arrondissement?.commune?.id);
        this.arrondissementRemoteAutocomplete.listRessource$ = of([parcelle?.arrondissement]);
        this.arrondissementRemoteAutocomplete.initialList = [parcelle?.arrondissement];

        this.parcellesAAjouter.insert(0, this.listParcelles(parcelle));
        this.dataSourceParcelleAAjoute.next(this.parcellesAAjouter.controls);
      });
    }

    this.formulaire.patchValue({
      numero: this.majLotissement.numero,
      action: this.transition.code
    });

  }

  listSectionsModifier(section: Section) {
    return this.fb.group({
      id: [section.id],
      numero: [section.numero,  Validators.compose([Validators.required])],
      numeroAncien: [section.numeroAncien],
      commune: [{value: section.commune.nom, disabled: true}]
    });
  }

  listIlotsModifier(ilot: IlotElement) {
    return this.fb.group({
      id: [ilot.id],
      numero: [ilot.numero,  Validators.compose([Validators.required])],
      numeroAncien: [ilot.numeroAncien]
    });
  }

  listIlotsAjouter(ilot: IlotElement) {
    return this.fb.group({
      id: [ilot.id],
      numeroAncien: [ilot.numeroAncien],
      section: [ilot.section.id, Validators.compose([Validators.required])]
    });
  }


  listSectionsAjouter(section: Section) {
    return this.fb.group({
      id: [section.id],
      numeroAncien: [section.numeroAncien],
      commune: [section.commune.id,  Validators.compose([Validators.required])]
    });
  }

  initSection() {
    if (!this.sectionRemoteAutocomplete.init) {
      this.sectionRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.sectionService);
      this.sectionRemoteAutocomplete.mapFunction = (section: Section) => {
        if (section.numeroAncien) {
          section.libelle = section.numeroAncien + " - " + section.numero;
        }
        return section;
      }
    }
  }

  listParcelles(parcelle: ParcelleElement = null) {

    return this.fb.group({
      id: [parcelle.id],
      ilot: [parcelle.ilot.id],
      superficie: [parcelle.superficie, Validators.compose([Validators.required])],
      numeroAncien: [parcelle.numeroAncien],
      libelle: [parcelle.libelle],
      arrondissement: [parcelle.arrondissement?.id],
      destination: [parcelle.destination?.id, Validators.compose([Validators.required])],
      quartier: [parcelle?.quartier?.id],
      localite: [parcelle.localite?.id, Validators.compose([Validators.required])],
      ordre: [parcelle.ordre],
      zone: [parcelle?.zone?.id]
    });
  }

  listParcellesModifier(parcelle: ParcelleElement = null) {

    return this.fb.group({
      id: [parcelle.id],
      superficie: [parcelle.superficie, Validators.compose([Validators.required])],
      numero: [parcelle.numero],
      numeroAncien: [parcelle.numeroAncien],
      libelle: [parcelle.libelle],
      arrondissement: [parcelle.arrondissement?.id],
      destination: [parcelle.destination?.id, Validators.compose([Validators.required])],
      quartier: [parcelle?.quartier?.id],
      localite: [parcelle.localite?.id, Validators.compose([Validators.required])],
      ordre: [parcelle.ordre],
      zone: [parcelle?.zone?.id]
    });
  }


  onSubmit() {
    if (!this.formulaire.valid) {
      return false;
    }
    this.loadingEvent.emit(true);

    let {action, numero,parcellesAAjouter,parcellesAModifier, sectionsAModifier, sectionsAAjouter, ilotsAModifier, ilotsAAjouter } = this.formulaire.value;
    let dataPost = { action, numero,parcellesAAjouter,parcellesAModifier, sectionsAModifier, sectionsAAjouter, ilotsAModifier, ilotsAAjouter}

    this.majLotissmentService.executer(dataPost).subscribe(data => {
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

  initIlot(){
    if(!this.ilotRemoteAutocomplete.init) {
      this.ilotRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.ilotService);
      this.ilotRemoteAutocomplete.mapFunction=(ilot: IlotElement)=>{
        if(ilot.numeroAncien) {
          ilot.libelle=ilot.numeroAncien+" - "+ilot.numero;
        }
        return ilot;
      }
    }
  }

  public onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchSection(eventNgSelect) {
    this.sectionRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchDestination(eventNgSelect){
    this.destinationRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchDestinationEdit(eventNgSelect){
    this.destinationRemoteAutocompleteAdd.term.next(eventNgSelect.term);
  }
  public onSearchQuartier(eventNgSelect){
    this.quartierRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchLocalite(eventNgSelect){
    this.localiteRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchArrondissement(eventNgSelect) {
    this.arrondissementRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchQuartierAdd(eventNgSelect){
    this.quartierRemoteAutocompleteAdd.term.next(eventNgSelect.term);
  }

  public onSearchLocaliteAdd(eventNgSelect){
    this.localiteRemoteAutocompleteAdd.term.next(eventNgSelect.term);
  }

  public onSearchArrondissementAdd(eventNgSelect) {
    this.arrondissementRemoteAutocompleteAdd.term.next(eventNgSelect.term);
  }

  public onSearchIlot(eventNgSelect) {
    this.ilotRemoteAutocomplete.term.next(eventNgSelect.term);
  }

}
