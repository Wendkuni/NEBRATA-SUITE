import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray, FormBuilder, FormGroup, Validators
} from "@angular/forms";
import {
  IlotElement, ParcelleElement
} from "@sycadApp/models/data-references/territoire/localite.model";
import {
  RemoteAutocomplete
} from "@sycadShared/form-components/model/remote-autocomplete";
import {
  Section
} from "@sycadApp/models/data-references/contribuables/global.model";
import {MatTableDataSource} from "@angular/material/table";
import {BehaviorSubject, of, Subject} from "rxjs";
import {
  CommunesService
} from "@sycadApp/services/data-references/territoire/communes.service";
import {
  SectionService
} from "@sycadApp/services/cession-parcelle/section.service";
import {
  IlotService
} from "@sycadApp/services/cession-parcelle/ilot.service";
import {
  CommuneAutocomplete
} from "@sycadApp/models/data-references/territoire/commune.model";
import {
  RemoteAutocompleteCommuneZoneCompetence
} from "@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import {MatSort} from "@angular/material/sort";
import {
  MatPaginator,
  PageEvent
} from "@angular/material/paginator";
import {
  PeriodicElement
} from "@sycadShared/form-components/plan-cadastral/ilot-parcelle-aajouter/ilot-parcelle-aajouter.component";
import {SycadUtils} from "@sycadShared/utils.functions";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  PlanCadastralRegularisationElement
} from "@sycadApp/models/workflow/regularisation.model";
import {
  AppConfirmService
} from "@sycadShared/app-confirm/app-confirm.service";

@Component({
  selector: 'app-ilot-parcelle-aajouter-form',
  templateUrl: './ilot-parcelle-aajouter-form.component.html',
  styleUrls: ['./ilot-parcelle-aajouter-form.component.scss'],
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
export class IlotParcelleAajouterFormComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
  @Input()
  touched: boolean;

  @Input('formGroup')
  ilotsAAjouter: FormArray;

  @Input('ilotsChoisie')
  ilotsChoisie: IlotElement[];

  @Input('simpleContribuable')
  simpleContribuable: boolean;

  @Input('live')
  live: boolean;

  @Output('change')
  public change: EventEmitter<IlotElement[]> = new EventEmitter<IlotElement[]>();
  @Input()
  public loadingEvent: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  @ViewChild(MatSort) sort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input('communeAutocomplete')
  commune: CommuneAutocomplete;
  @Input()
  public sdMaj: PlanCadastralRegularisationElement;
  dataSourceIlot = new MatTableDataSource<IlotElement>([]);

  dataSourceAllIlots = new MatTableDataSource<IlotElement>([])


  public ilotsChoisieIdIlotA: Number[];
  public sectionChoisieIdIlotA: number;
  public numeroSectionChoisie: string;
  public communeIdIlotA: number;


  public communeRemoteAutocomplete;
  public sectionRemoteAutocomplete = new RemoteAutocomplete<Section>();
  public ilotRemoteAutocomplete = new RemoteAutocomplete<IlotElement>();
  public dataSource = new BehaviorSubject<AbstractControl[]>([]);
  public displayedColumns: string[] = ['numero', 'numeroAncien', 'section', 'actions'];
  columnsToDisplay = ['numero', 'numeroAncien', 'actions'];
  columnsToDisplay2 = ['numero', 'numeroAncien', 'destination', 'superficie', 'localite', 'arrondissement', 'quartier'];
  public lIlots: any = [];
  expandedElement: PeriodicElement;
  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;

  private _onDestroy = new Subject<void>();

  onChange: any = (_: Number) => {
  };

  onTouch: any = () => {
  };

  constructor( public confirmService:AppConfirmService,public communeService: CommunesService,
              public sectionService: SectionService,
              public ilotService: IlotService,public _snackBar: MatSnackBar,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    if (this.simpleContribuable) {
      this.communeRemoteAutocomplete = new RemoteAutocomplete<CommuneAutocomplete>();
    } else {
      this.communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();
    }


    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);

    if (this.ilotsChoisie && this.ilotsChoisie.length > 0) {

      this.communeRemoteAutocomplete.listRessource$ = of([this.ilotsChoisie[0]?.section.commune]);
      this.communeRemoteAutocomplete.initialList = [this.ilotsChoisie[0]?.section.commune];
      this.communeIdIlotA = this.ilotsChoisie[0]?.section.commune.id;
      this.commune = this.ilotsChoisie[0].section.commune;

      this.sectionRemoteAutocomplete.params.set("commune", this.communeIdIlotA);
      this.sectionRemoteAutocomplete.listRessource$ = of([this.ilotsChoisie[0]?.section]);
      this.sectionRemoteAutocomplete.initialList = [this.ilotsChoisie[0]?.section];
      this.sectionChoisieIdIlotA = this.ilotsChoisie[0]?.section.id;
      this.numeroSectionChoisie = this.ilotsChoisie[0].section.numero;
      this.initSection();

      this.ilotRemoteAutocomplete.params.set("section", this.sectionChoisieIdIlotA);
      this.ilotRemoteAutocomplete.listRessource$ = of(this.ilotsChoisie);
      this.ilotRemoteAutocomplete.initialList = this.ilotsChoisie;
      this.initIlot();
      this.lIlots = this.lIlots.concat(this.ilotsChoisie);
      this.ilotsChoisie.forEach(ilot=>{
         this.ilotsAAjouter.insert(0, this.createIlot(ilot));
      });
      this.dataSourceAllIlots.data = [...this.ilotsChoisie,...this.dataSourceAllIlots.data];
      this.totalElements = this.dataSourceAllIlots.data.length;
      this.updateDataSource();
      this.updateTableIlot();

    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const data = {title: "Confirmation",
      message: "Attention! La commune contient déjà des ilots.\n" +
        "\nSi vous continuez, les données seront perdues!\n" +
        "\nVoulez-vous vraiment continuer ?"}
  }
  ngOnDestroy() {

    this._onDestroy.next();
    this._onDestroy.complete();
    // if (this.dataSource) {
    //   // this.addNewSection();
    // }
  }
  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: Number) => {}): void {
    this.onTouch = fn;
  }
  writeValue(id: null | Number[]): void {
    this.ilotsChoisieIdIlotA = id;
    if (id === null) {
      this.communeIdIlotA = null;
      this.sectionChoisieIdIlotA = null;
      this.ilotsChoisie = null;
      this.dataSource = null;
      this.ilotRemoteAutocomplete.listRessource$ = of([]);
      this.sectionRemoteAutocomplete.listRessource$ = of([]);

      this.ilotRemoteAutocomplete.resetParams();
      this.sectionRemoteAutocomplete.resetParams();
    }

  }





  updateIlotFilter() {
    this.ilotRemoteAutocomplete.params.set('section', this.sectionChoisieIdIlotA);
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


  public onSearchIlot(eventNgSelect) {
    this.ilotRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  initIlot() {
    if (!this.ilotRemoteAutocomplete.init) {
      this.ilotRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.ilotService);
      this.ilotRemoteAutocomplete.mapFunction = (ilot: IlotElement) => {
        if (ilot.numeroAncien) {
          ilot.libelle = ilot.numeroAncien + " - " + ilot.numero;
        }
        return ilot;
      }
    }
    this.updateIlotFilter();
  }

  public onSearchSection(eventNgSelect) {
    this.sectionRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onChangeSection(section: Section) {
    this.initIlot();
   this.sectionChoisieIdIlotA = section.id;
    this.commune = section.commune;
    this.numeroSectionChoisie = section.numero;
    this.ilotsAAjouter.controls = [];
    this.dataSourceAllIlots.data = [];
    this.dataSourceIlot.data = [];
    this.totalElements = 0;
    this.onChange(null);
    this.ilotRemoteAutocomplete.params.set("section", section?.id);
    this.ilotRemoteAutocomplete.term.next("");
  }


  createIlot(ilot: IlotElement = null) {

    if (this.live) {
      if (ilot == null) {
        return this.fb.group({
          id: [null,],
          numeroAncien: [null],
          section: [null, Validators.compose([Validators.required])],
        });
      } else {
        return this.fb.group({
          id: [ilot.id],
          numeroAncien: [ilot.numeroAncien],
          section: [ilot.section.id, Validators.compose([Validators.required])],
        });
      }
    } else {
      if (ilot == null) {
        return this.fb.group({
          id: [null,],
          numero: [null, Validators.compose([Validators.required])],
          numeroAncien: [null],
          section: [null, Validators.compose([Validators.required])],
        });
      } else {
        const parcellesFormArray = this.fb.array(ilot.parcelles.map(parcelle => this.creerParcelleFormGroup(parcelle)));
        return this.fb.group({
          id: [ilot.id],
          numero: [ilot.numero, Validators.compose([Validators.required])],
          numeroAncien: [ilot.numeroAncien],
          section: [ilot.section?.id, Validators.compose([Validators.required])],
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
      superficie: [parcelle.superficie ? parcelle.superficie: 0],
      quartier: [parcelle.quartier?.id, ],
      localite: [parcelle.localite?.id,],
      zone: [parcelle.zone?.id],
      arrondissement: [parcelle.arrondissement?.id,],
      ordre: [parcelle.ordre,]
    });
  }



  supprimerIlot(element: IlotElement) {
    const index = this.dataSourceIlot.data.findIndex(ilot => ilot.numero === element.numero && ilot.numeroAncien === element.numeroAncien);
    const  indexAAjouter = this.dataSourceAllIlots.data.findIndex(ilot=>ilot.numero ===element.numero && ilot.numeroAncien===element.numeroAncien);
    if (index > -1) {
      this.dataSourceIlot.data.splice(index, 1);
      this.dataSourceAllIlots.data.splice(indexAAjouter, 1);
      this.dataSourceIlot._updateChangeSubscription();
      this.dataSourceAllIlots._updateChangeSubscription();
    }
    this.ilotsAAjouter.controls = [];
    this.loadingEvent.emit(true);
    this.dataSourceAllIlots.data.forEach(ilot => {
      this.addNewIlot(ilot);
      this.loadingEvent.emit(false);
    });

    // Recalculer le total d'elements après suppression
    this.totalElements = this.dataSourceAllIlots.data.length;
    // Mettre à jour les données sources et du formulaire
    this.updateDataSource();
  }

  addNewIlot(ilot: IlotElement = null) {
    this.ilotsAAjouter.insert(0, this.createIlot(ilot));
    this.dataSource.next(this.ilotsAAjouter.controls);
  }
  public updateTableIlot() {
    this.dataSource.next(this.ilotsAAjouter.controls);
  }

  initializeForm() {
    this.dataSourceAllIlots.data = [];
    this.ilotsAAjouter.controls = [];
    this.dataSourceIlot.data = [];
    this.getAllIlots();
    // this.dataSourceTable.sort = this.sort;
    this.totalElements = this.dataSourceAllIlots.data.length;
  }

  updateDataSource(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSourceIlot.data = this.dataSourceAllIlots.data.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }

  getAllIlots() {
    this.loadingEvent.emit(true);
    this.ilotService.getIlotsByCodeCommuneAndNumeroSection(this.commune.code, this.numeroSectionChoisie).subscribe(
      data => {
        this.ilotsChoisie = data;
        this.dataSourceAllIlots.data = [...data, ...this.dataSourceAllIlots.data];
        const total = data.length;
        this.totalElements = this.dataSourceAllIlots.data.length;
        this.dataSourceAllIlots.data.forEach(ilot=>{
          this.addNewIlot(ilot);
        },errorResponse=>{
          this.loadingEvent.emit(false);
          SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
        });
        this.updateDataSource();
        this.loadingEvent.emit(false);
        this.sectionService.openSnackBar(total +" "+"nouveaux ilots chargés avec succès","Ok");
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      }
    )
  }
}
