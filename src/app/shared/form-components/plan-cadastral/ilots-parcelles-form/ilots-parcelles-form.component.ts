import {
  ChangeDetectorRef,
  Component, EventEmitter, Input, OnChanges, OnDestroy,
  OnInit, Output, SimpleChanges, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import {
  AbstractControl, ControlValueAccessor,
  FormArray,
  FormBuilder, FormGroup, Validators
} from "@angular/forms";
import {
  IlotElement, ParcelleElement, ParcelleMap, TypeLocalite
} from "@sycadApp/models/data-references/territoire/localite.model";
import {MatSort} from "@angular/material/sort";
import {
  MatPaginator,
  PageEvent
} from "@angular/material/paginator";
import {
  CommuneAutocomplete
} from "@sycadApp/models/data-references/territoire/commune.model";
import {
  PlanCadastralRegularisationElement
} from "@sycadApp/models/workflow/regularisation.model";
import {MatTableDataSource} from "@angular/material/table";
import {
  RemoteAutocomplete
} from "@sycadShared/form-components/model/remote-autocomplete";
import {BehaviorSubject, of, Subject} from "rxjs";
import {
  PeriodicElement
} from "@sycadShared/form-components/plan-cadastral/ilot-parcelle-aajouter/ilot-parcelle-aajouter.component";
import {
  AppConfirmService
} from "@sycadShared/app-confirm/app-confirm.service";
import {
  CommunesService
} from "@sycadApp/services/data-references/territoire/communes.service";
import {
  SectionService
} from "@sycadApp/services/cession-parcelle/section.service";
import {
  IlotService
} from "@sycadApp/services/cession-parcelle/ilot.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  RemoteAutocompleteArrondissementZoneCompetence,
} from "@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence";
import {SycadUtils} from "@sycadShared/utils.functions";
import {
  ArrondissementAutocomplete, ArrondissementItem
} from "@sycadApp/models/data-references/territoire/arrondissement.model";
import {
  ArrondissementsService
} from "@sycadApp/services/data-references/territoire/arrondissements.service";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-ilots-parcelles-form',
  templateUrl: './ilots-parcelles-form.component.html',
  styleUrls: ['./ilots-parcelles-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({
        height: '0px',
        minHeight: '0',
        display: 'none'
      })),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class IlotsParcellesFormComponent implements OnInit, OnDestroy, OnChanges {

  @Input()
  touched: boolean;

  @Input('formGroup')
  ilotsAAjouter: FormArray;

  @Input('ilotsChoisie')
  ilotsChoisie: IlotElement[];

  @Input('live')
  live: boolean;

  @Input()
  public loadingEvent: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  @Output() arrondissementChange = new EventEmitter<number>();

  @ViewChild(MatSort) sort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input('communeAutocomplete')
  commune: CommuneAutocomplete;

  @Input()
  public sdMaj: PlanCadastralRegularisationElement;

  dataSourceIlot = new MatTableDataSource<IlotElement>([]);

  public arrondissementRemoteAutocomplete = new RemoteAutocompleteArrondissementZoneCompetence<ArrondissementAutocomplete>();

  dataSourceParcelle = new MatTableDataSource<ParcelleMap>([]);

  public arrondissementChoisieId: number;

  public communeRemoteAutocomplete;
  public ilotRemoteAutocomplete = new RemoteAutocomplete<IlotElement>();
  readonly columnsParcelleToDisplay = ['nston','nstoa','nilotn','nilota','nplen','nplea','supm2','destinat','nsect','nqart'];
  codeArrondissementChoisie: string;

  error: string | null = null;
  pageParcelleSize = 10;
  pageParcelleIndex = 0;
  totalParcelleElements:number;
  public readonly destroy$ = new Subject<void>();
  groupByFnArrondissement = (item) => item.commune.nom;
  groupValueFnArrondissement = (_: string, communes: any[]) => ({
    name: communes[0].commune.nom,
    total: communes.length
  });

  private _onDestroy = new Subject<void>();

  onChange: any = (_: Number) => {
  };

  onTouch: any = () => {
  };

  constructor(private confirmService: AppConfirmService,private arrondissementService: ArrondissementsService, private communeService: CommunesService,
              private sectionService: SectionService,
              private ilotService: IlotService, private _snackBar: MatSnackBar,
              private fb: FormBuilder,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementService);
    this.commune = this.sdMaj?.commune;
    this.arrondissementChoisieId = this.sdMaj?.arrondissement?.id;
    this.codeArrondissementChoisie = this.sdMaj?.arrondissement?.code;
    this.loadParcellesByArrondissement();
  }

  ngOnChanges(changes: SimpleChanges) {
    const data = {
      title: "Confirmation",
      message: "Attention! La commune contient déjà des ilots.\n" +
        "\nSi vous continuez, les données seront perdues!\n" +
        "\nVoulez-vous vraiment continuer ?"
    }
  }

  ngOnDestroy() {

    this._onDestroy.next();
    this._onDestroy.complete();
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: Number) => {}): void {
    this.onTouch = fn;
  }

  public onSearchArrondissement(eventNgSelect) {
    this.arrondissementRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onChangeArrondissement(arrondissement: ArrondissementItem) {
    this.codeArrondissementChoisie = arrondissement.code;
    this.arrondissementChange.emit(arrondissement.id);
   this.resetData();
  }
  private resetData(): void {
    this.ilotsAAjouter.clear();
    this.dataSourceParcelle.data = [];
    this.totalParcelleElements = 0;
    this.cdr.markForCheck();
  }
  createIlot(ilot: IlotElement = null) {
    if (this.live) {
      if (ilot == null) {
        return this.fb.group({
          id: [null,],
          numeroAncien: [null],
          section: [null],
          arrondissement: [null],
        });
      } else {
        return this.fb.group({
          id: [ilot.id],
          numeroAncien: [ilot.numeroAncien],
          section: [ilot.section.id,],
          arrondissement: [ilot.arrondissement?.id],
        });
      }
    } else {
      if (ilot == null) {
        return this.fb.group({
          id: [null,],
          numero: [null, ],
          numeroAncien: [null],
          section: [null, ],
          arrondissement: [null],
        });
      } else {
        const parcellesFormArray = this.fb.array(ilot.parcelles.map(parcelle => this.creerParcelleFormGroup(parcelle)));
        return this.fb.group({
          id: [ilot.id],
          numero: [ilot.numero, ],
          numeroAncien: [ilot.numeroAncien],
          section: [ilot.section?.id,],
          arrondissement: [ilot.arrondissement?.id],
          parcelles: parcellesFormArray
        });
      }
    }

  }

  creerParcelleFormGroup(parcelle: ParcelleElement): FormGroup {
    return this.fb.group({
      id: [parcelle.id],
      numero: [parcelle.numero, Validators.compose([Validators.required])],
      numeroAncien: [parcelle.numeroAncien],
      libelle: [parcelle.libelle],
      destination: [parcelle.destination?.id,],
      superficie: [parcelle.superficie ? parcelle.superficie : 0],
      quartier: [parcelle.quartier?.id,],
      localite: [parcelle.localite?.id,],
      zone: [parcelle.zone?.id],
      arrondissement: [parcelle.arrondissement?.id,],
      ordre: [parcelle.ordre,]
    });
  }


  addNewIlot(ilot: IlotElement = null) {
    this.ilotsAAjouter.insert(0, this.createIlot(ilot));
  }


  loadParcellesByArrondissement(): void {
    this.loadingEvent.emit(true);
    this.error = null;
    this.ilotService
      .getParcellesByArrondissement(this.codeArrondissementChoisie, this.commune.code, this.pageParcelleIndex, this.pageParcelleSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dataSourceParcelle.data = response.content;
          this.totalParcelleElements = response.totalElements;
          this.mapToIlots(response.content).forEach(ilot=>{
            this.addNewIlot(ilot);
          })
          this.loadingEvent.emit(false);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des ilots';
          SycadUtils.notifyRemoteError(this.error,this._snackBar);
          this.loadingEvent.emit(false);
          this.cdr.markForCheck();
        }
      });
  }
  mapToIlots(parcelles: ParcelleMap[]):IlotElement[] {
    // Grouper les parcelles par numéro d'îlot
    const ilotMap = new Map<string, ParcelleMap[]>();

    parcelles.forEach(parcelle => {
      if (!ilotMap.has(parcelle.nilotn)) {
        ilotMap.set(parcelle.nilotn, []);
      }
      ilotMap.get(parcelle.nilotn)?.push(parcelle);
    });

    // Transformer la Map en tableau d'Ilots
    return Array.from(ilotMap.entries()).map(([numero, parcelles]) => {
      // Prendre le premier élément pour les données de l'îlot
      const premiereParcelle = parcelles[0];
      return {
        id: null,
        numero: premiereParcelle.nilotn,
        libelle: null,
        numeroAncien: premiereParcelle.nilota,
        section: {
          id:null,
          numero: premiereParcelle.nston,
          libelle: `Section ${premiereParcelle.nsect}`,
          numeroAncien: null,
          commune: null,
        },
        arrondissement: null,
        parcelles: parcelles.map(p => this.mapToParcelle(p))
      };
    });
  }

  onParcellePageChange(event: PageEvent): void {
    this.pageParcelleIndex = event.pageIndex;
    this.pageParcelleSize = event.pageSize;
    this.loadParcellesByArrondissement();
  }
  private mapToParcelle(geoServerParcelle: ParcelleMap): ParcelleElement {
    return {
      id: null,
      numero: geoServerParcelle.nplen,
      numeroAncien: geoServerParcelle.nplea,
      superficie: geoServerParcelle.supm2,
      icad: null,
      libelle: null,
      label: null,
      etatMev: null,
      dateEtatMev: null,
      vci: null,
      dateEval: null,
      ilot: null,
      lotissement: null,
      morcellement: null,
      fusionnement: null,
      amenagement: null,
      destination: null,
      etatAttribution: null,
      arrondissement: geoServerParcelle.arrondissement,
      quartier: {
        id: null,
        nom: geoServerParcelle.nqart,
        commune: null
      },
      localite: {
        id: null,
        nom: `Secteur ${geoServerParcelle.nsect}`,
        arrondissement: null,
        typeLocalite: TypeLocalite.SECTEUR,
        code: geoServerParcelle.nsect
      },
      zone: null,
      cycleDeVie: null,
      ordre: null,
      territoireZone: null,
      domaine: null
    };
  }

}
