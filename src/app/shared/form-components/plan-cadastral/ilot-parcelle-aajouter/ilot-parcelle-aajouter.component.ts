import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output, SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {
  MatPaginator,
  PageEvent
} from "@angular/material/paginator";
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup, Validators
} from "@angular/forms";
import {
  IlotElement, ParcelleElement
} from "@sycadApp/models/data-references/territoire/localite.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  IlotService
} from "@sycadApp/services/cession-parcelle/ilot.service";
import {
  CommuneAutocomplete
} from "@sycadApp/models/data-references/territoire/commune.model";
import {
  RemoteAutocomplete
} from "@sycadShared/form-components/model/remote-autocomplete";
import {
  Ilot,
  Section
} from "@sycadApp/models/data-references/contribuables/global.model";
import {of, Subject} from "rxjs";
import {
  SectionService
} from "@sycadApp/services/cession-parcelle/section.service";
import {SycadUtils} from "@sycadShared/utils.functions";

@Component({
  selector: 'app-ilot-parcelle-aajouter',
  templateUrl: './ilot-parcelle-aajouter.component.html',
  styleUrls: ['./ilot-parcelle-aajouter.component.scss'],
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
export class IlotParcelleAajouterComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
  @Input('live')
  live: boolean;
  @Input('formGroup')
  ilotsAAjouter: FormArray;
  @Input('communeAutocomplete')
  commune: CommuneAutocomplete;
  @ViewChild(MatSort) sort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output('change')
  public change: EventEmitter<IlotElement[]> = new EventEmitter<IlotElement[]>();
  @Input()
  public loadingEvent: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  public sectionChoisieIdIlotA: number;
  public communeIdIlotA: number;
  public sectionRemoteAutocomplete = new RemoteAutocomplete<Section>();
  dataSource = new MatTableDataSource<IlotElement>([]);

  dataSourceTable = new MatTableDataSource<IlotElement>([])


  columnsToDisplay = ['numero', 'numeroAncien', 'actions'];
  columnsToDisplay2 = ['numero', 'numeroAncien', 'destination', 'superficie', 'localite', 'arrondissement', 'quartier'];
  expandedElement: PeriodicElement;
  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;
  numeroSectionChoisie: string;

  private _onDestroy = new Subject<void>();

  onChange: any = (_: Number) => {
  };

  onTouch: any = () => {
  };

  constructor(private ilotService: IlotService, public sectionService: SectionService, private fb: FormBuilder, public _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['commune'] && changes['commune'].currentValue) {
      this.dataSourceTable.data = [];
      this.dataSource.data = [];
      this.ilotsAAjouter.controls = [];
      this.sectionChoisieIdIlotA = null;
      this.initSection();
      this.numeroSectionChoisie = null;
      this.onChange(null);
      this.sectionRemoteAutocomplete.params.set("commune", this.commune?.id);
      this.sectionRemoteAutocomplete.term.next("");
    }else {

    }
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: Number) => {}): void {
    this.onTouch = fn;
  }

  writeValue(id: null | Number[]): void {
    if (id === null) {
      this.sectionChoisieIdIlotA = null;
      this.sectionRemoteAutocomplete.listRessource$ = of([]);
      this.dataSource = null;
      this.sectionRemoteAutocomplete.resetParams();
    }
  }

  public onSearchSection(eventNgSelect) {
    this.sectionRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onChangeSection(section: Section) {
    this.numeroSectionChoisie = section.numero;
    this.ilotsAAjouter.controls = [];
    this.dataSourceTable.data = [];
    this.dataSource.data = [];
    this.totalElements = 0;
    this.onChange(null);
  }

  supprimerIlot(element: IlotElement) {

    const index = this.dataSource.data.findIndex(ilot => ilot.numero === element.numero && ilot.numeroAncien === element.numeroAncien);
    const  indexAAjouter = this.dataSourceTable.data.findIndex(ilot=>ilot.numero ===this.dataSource.data[index].numero && ilot.numeroAncien===this.dataSource.data[index].numeroAncien);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSourceTable.data.splice(indexAAjouter ,1);
      this.dataSource._updateChangeSubscription(); // Mettez à jour la table après la suppression

    }
    this.ilotsAAjouter.controls = [];
    this.loadingEvent.emit(true);
    this.dataSourceTable.data.forEach(ilot => {
      this.addNewIlot(ilot);
      this.loadingEvent.emit(false);
    });
    // Recalculer le total d'elements après suppression
    this.totalElements = this.dataSourceTable.data.length;
    // Mettre à jour les données sources et du formulaire
    this.updateDataSource();
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

  addNewIlot(ilot: IlotElement = null) {
    this.ilotsAAjouter.insert(0, this.createIlot(ilot));
  }

  initializeForm() {
    this.dataSourceTable.data = [];
    this.dataSource.data = [];
    this.ilotsAAjouter.controls = [];
    this.getAllIlots();
  }

  updateDataSource(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSource.data = this.dataSourceTable.data.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
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
          section: [this.sectionChoisieIdIlotA, Validators.compose([Validators.required])],
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
        const parcellesFormArray = this.fb.array((ilot.parcelles).map(parcelle => this.creerParcelleFormGroup(parcelle)));
        return this.fb.group({
          id: [ilot.id],
          numero: [ilot.numero, Validators.compose([Validators.required])],
          numeroAncien: [ilot.numeroAncien],
          section: [this.sectionChoisieIdIlotA, Validators.compose([Validators.required])],
          parcelles: parcellesFormArray,
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
      superficie: [parcelle.superficie?parcelle.superficie: 0],
      quartier: [parcelle.quartier?.id,],
      localite: [parcelle.localite?.id,],
      zone: [parcelle.zone?.id],
      arrondissement: [parcelle.arrondissement.id,],
      ordre: [parcelle.ordre,]
    });
  }

  getAllIlots() {
    this.loadingEvent.emit(true);
    this.ilotService.getIlotsByCodeCommuneAndNumeroSection(this.commune.code, this.numeroSectionChoisie).subscribe(
      data => {
        this.dataSourceTable.data = [...data, ...this.dataSourceTable.data];
        const  total = data.length;
        this.totalElements = this.dataSourceTable.data.length;
        this.dataSourceTable.data.forEach(ilot => {
          this.addNewIlot(ilot);
        }, errorResponse => {
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

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

