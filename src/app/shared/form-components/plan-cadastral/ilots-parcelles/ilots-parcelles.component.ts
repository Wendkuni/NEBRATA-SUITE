import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {
  CommuneAutocomplete
} from "@sycadApp/models/data-references/territoire/commune.model";
import {MatSort} from "@angular/material/sort";
import {
  MatPaginator,
  PageEvent
} from "@angular/material/paginator";
import {
  IlotElement,
  ParcelleElement,
  ParcelleMap,
  TypeLocalite,
} from "@sycadApp/models/data-references/territoire/localite.model";
import {MatTableDataSource} from "@angular/material/table";
import {EMPTY, expand, reduce, Subject} from "rxjs";
import {
  IlotService
} from "@sycadApp/services/cession-parcelle/ilot.service";
import {
  SectionService
} from "@sycadApp/services/cession-parcelle/section.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  RemoteAutocompleteArrondissementZoneCompetence,
} from "@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence";
import {
  ArrondissementAutocomplete,
  ArrondissementItem
} from "@sycadApp/models/data-references/territoire/arrondissement.model";
import {
  ArrondissementsService
} from "@sycadApp/services/data-references/territoire/arrondissements.service";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import {HttpClient} from "@angular/common/http";
import {map, takeUntil} from "rxjs/operators";
import {SycadUtils} from "@sycadShared/utils.functions";
@Component({
  selector: 'app-ilots-parcelles',
  templateUrl: './ilots-parcelles.component.html',
  styleUrls: ['./ilots-parcelles.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class IlotsParcellesComponent implements OnInit, OnDestroy {
  @Input() live = false;
  @Input("formGroup") ilotsAAjouter: FormArray;
  @Input() commune: CommuneAutocomplete;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() change = new EventEmitter<IlotElement[]>();
  @Input() loadingEvent = new EventEmitter<boolean>();
  @Output() arrondissementChange = new EventEmitter<number>();

  readonly columnsParcelleToDisplay =
    ['nston','nstoa','nilotn','nilota','nplen','nplea','supm2','destinat','nsect','nqart'];
  private allIlotsCache: IlotElement[] = [];
  readonly pageSizeOptions = [5, 10, 25, 50, 100];
  groupByFnArrondissement = (item) => item.commune.nom;
  groupValueFnArrondissement = (_: string, communes: any[]) => ({
    name: communes[0].commune.nom,
    total: communes.length
  });

  dataSource = new MatTableDataSource<IlotElement>([]);
  dataSourceParcelle = new MatTableDataSource<ParcelleMap>([]);
  expandedElement: IlotElement | null = null;
  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;
  error: string | null = null;
  totalParcelleElements:number;


  public readonly destroy$ = new Subject<void>();
  public arrondissementRemoteAutocomplete: RemoteAutocompleteArrondissementZoneCompetence<ArrondissementAutocomplete>;
  public codeArrondissementChoisie: string;

  constructor(
    private http: HttpClient,
    private arrondissementService: ArrondissementsService,
    private ilotService: IlotService,
    private sectionService: SectionService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.arrondissementRemoteAutocomplete = new RemoteAutocompleteArrondissementZoneCompetence<ArrondissementAutocomplete>();
  }

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(
      this.destroy$,
      this.arrondissementService
    );

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  onSearchArrondissement(event: any): void {
    this.arrondissementRemoteAutocomplete.term.next(event.term);
  }

  onChangeArrondissement(arrondissement: ArrondissementItem): void {
    this.codeArrondissementChoisie = arrondissement.code;
    this.arrondissementChange.emit(arrondissement.id);
    this.resetData();
  }

  private resetData(): void {
    this.ilotsAAjouter.clear();
    this.dataSource.data = [];
    this.dataSourceParcelle.data = [];
    this.totalElements = 0;
    this.totalParcelleElements = 0;
    this.pageIndex = 0;
    this.change.emit([]);
    this.cdr.markForCheck();
  }

  loadIlots(): void {
    this.loadingEvent.emit(true);
    this.error = null;
    this.ilotService
      .getIlots(this.codeArrondissementChoisie, this.commune.code, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.content;
          response.content.forEach(ilot=>{
            this.addNewIlot(ilot);
          })
          this.totalElements = response.totalElements;
          this.loadingEvent.emit(false);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des ilots';
          SycadUtils.notifyRemoteError(this.error,this.snackBar);
          this.loadingEvent.emit(false);
          this.cdr.markForCheck();
        }
      });
  }

  loadParcellesByArrondissement(): void {
    this.loadingEvent.emit(true);
    this.error = null;
    this.ilotService
      .getParcellesByArrondissement(this.codeArrondissementChoisie, this.commune.code, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dataSourceParcelle.data = response.content;
          this.totalParcelleElements = response.totalElements;
          this.transformToIlots(response.content).forEach(ilot=>{
            this.addNewIlot(ilot);
          })
          this.loadingEvent.emit(false);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des ilots';
          SycadUtils.notifyRemoteError(this.error,this.snackBar);
          this.loadingEvent.emit(false);
          this.cdr.markForCheck();
        }
      });
  }

  addNewIlot(ilot: IlotElement | null = null): void {
    this.ilotsAAjouter.insert(0, this.createIlot(ilot));
  }

  createIlot(ilot: IlotElement | null = null): FormGroup {
    if (this.live) {
      if (ilot == null) {
        return this.fb.group({
          id: [null,],
          numeroAncien: [null],
          section: [null, Validators.compose([Validators.required])],
          arrondissement: [null,],
        });
      } else {
        return this.fb.group({
          id: [ilot.id],
          numeroAncien: [ilot.numeroAncien],
          section: [ilot.section.id, Validators.compose([Validators.required])],
          arrondissement: [ilot.arrondissement?.id,],
        });
      }
    } else {
      if (ilot == null) {
        return this.fb.group({
          id: [null,],
          numero: [null, Validators.compose([Validators.required])],
          numeroAncien: [null],
          section: [null, Validators.compose([Validators.required])],
          arrondissement: [null,],
        });
      } else {
        const parcellesFormArray = this.fb.array(ilot.parcelles.map(parcelle => this.creerParcelleFormGroup(parcelle)));
        return this.fb.group({
          id: [ilot?.id],
          numero: [ilot.numero, Validators.compose([Validators.required])],
          numeroAncien: [ilot.numeroAncien],
          section: [ilot.section?.id,],
          arrondissement: [ilot.arrondissement?.id,],
          parcelles: parcellesFormArray
        });
      }
    }
  }

  creerParcelleFormGroup(parcelle: ParcelleElement): FormGroup {
    return this.fb.group({
      id: [parcelle.id],
      numero: [parcelle.numero, [Validators.required]],
      numeroAncien: [parcelle.numeroAncien],
      libelle: [parcelle.libelle],
      destination: [parcelle.destination?.id],
      superficie: [parcelle.superficie || 0],
      quartier: [parcelle.quartier?.id],
      localite: [parcelle.localite?.id],
      zone: [parcelle.zone?.id],
      arrondissement: [parcelle.arrondissement?.id],
      ordre: [parcelle.ordre]
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadIlots();
  }
  onParcellePageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadParcellesByArrondissement();
  }

  transformToIlots(parcelles: ParcelleMap[]):IlotElement[] {
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
        parcelles: parcelles.map(p => this.transformToParcelle(p))
      };
    });
  }

  private transformToParcelle(geoServerParcelle: ParcelleMap): ParcelleElement {
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
  private loadAllIlotsInBackground(): void {
    const batchSize = 100;
    let currentPage = 0;
    this.ilotsAAjouter.clear();
    this.ilotService
      .getIlots(this.codeArrondissementChoisie, this.commune.code, 0, batchSize)
      .pipe(
        takeUntil(this.destroy$),
        expand(response => {
          currentPage++;
          if (currentPage * batchSize < response.totalElements) {
            return this.ilotService.getIlots(
              this.codeArrondissementChoisie,
              this.commune.code,
              currentPage,
              batchSize
            );
          }
          return EMPTY;
        }),
        reduce((acc: IlotElement[], response) => [...acc, ...response.content], []),
        map((ilots: IlotElement[]) => {
          // Filtrer pour ne garder que les îlots avec numéros numériques
          return ilots.filter(ilot => {
            const numeroIsNumeric = /^\d+$/.test(ilot.numero);
            if (!numeroIsNumeric) return false;

            // Vérifier si tous les numéros de parcelles sont des chaînes numériques
            const parcellesNumeriques = ilot.parcelles.every((parcelle) =>
              /^\d+$/.test(parcelle.numero)
            );
            if (!parcellesNumeriques) return false;

            // Éliminer les doublons de parcelles
            const parcelsSet = new Set(ilot.parcelles.map((p) => p.numero));
            if (parcelsSet.size !== ilot.parcelles.length) return false;

            return true;
          });
        })
      )
      .subscribe({
        next: (filteredIlots) => {
          // Mettre à jour le cache avec les îlots filtrés
          this.allIlotsCache = filteredIlots;
          this.totalElements = this.allIlotsCache.length;
          this.allIlotsCache.forEach(ilot=>{
            this.addNewIlot(ilot);
          });
          // this.loadingEvent.emit(false);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des ilots';
          SycadUtils.notifyRemoteError(this.error,this.snackBar);
          this.loadingEvent.emit(false);
        }
      });
  }
}
