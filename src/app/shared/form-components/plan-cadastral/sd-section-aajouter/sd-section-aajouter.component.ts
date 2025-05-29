import {
  Component, EventEmitter, Input,
  OnChanges,
  OnDestroy,
  OnInit, SimpleChanges, ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup, Validators
} from '@angular/forms';
import {
  MatPaginator,
  PageEvent
} from '@angular/material/paginator';
import {
  Section
} from '@sycadApp/models/data-references/contribuables/global.model';
import {BehaviorSubject, Subject} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {
  CommunesService
} from '@sycadApp/services/data-references/territoire/communes.service';
import {
  SectionService
} from '@sycadApp/services/cession-parcelle/section.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  CommuneAutocomplete
} from '@sycadApp/models/data-references/territoire/commune.model';

import {SycadUtils} from "@sycadShared/utils.functions";

@Component({
  selector: 'app-sd-section-aajouter',
  templateUrl: './sd-section-aajouter.component.html',
  styleUrls: ['./sd-section-aajouter.component.scss']
})
export class SdSectionAajouterComponent implements OnDestroy, OnInit, OnChanges {
  @Input()
  touched: boolean;
  @Input('live')
  live: boolean;
  @Input('formGroup')
  sectionAAjouter: FormArray;
  @Input('simpleContribuable')
  simpleContribuable: boolean;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  sections: Section[] = [];
  isButtonDisabled = false;
  @Input('communeAutocomplete')
  commune: CommuneAutocomplete;
  @Input()
  public loadingEvent: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  filteredSections: Section[] = [];
  public communeRemoteAutocomplete;
  public dataSource = new BehaviorSubject<AbstractControl[]>([]);
  private _onDestroy = new Subject<void>();
  displayedColumns: string[] = ['numero', 'numeroAncien', 'commune', 'actions'];
  dataSourceSection = new MatTableDataSource<Section>([]);
  dataSourceAllSection = new MatTableDataSource<Section>([]);
  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;
  totalGeoserver = 0;
  filterValue = '';

  constructor(private fb: FormBuilder, public communeService: CommunesService, private sectionService: SectionService, public _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['commune'] && changes['commune'].currentValue) {
      this.sections = [];
      this.totalElements = 0;
      this.isButtonDisabled = false;
      this.dataSourceSection.data = [];
    } else {
      this.sections = [];
      this.totalElements = 0;
      this.isButtonDisabled = true;
      this.dataSourceSection.data = [];
    }
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  initializeForm() {
    this.sections = [];
    this.sectionAAjouter.controls = [];
    this.totalElements = 0;
    this.loadingEvent.emit(true);
    if(this.commune === null || this.commune === undefined){
      this.loadingEvent.emit(false);
      this.sectionService.openSnackBar("Vous devez choisir la commune avant de charger!","Ok");
    }
    this.sectionService.getSectionsByCodeCommune(this.commune.code).subscribe(data => {
        this.sections = data;
        this.dataSourceAllSection.data = data;
        this.totalGeoserver = data.length;
        this.totalElements = this.sections.length;
        this.sortSectionsByNumero();
        this.updateDataSource();
        this.sections.forEach(section => {
          this.sectionAAjouter.push(this.createSectionGroup(section));
          this.loadingEvent.emit(false);
        });
        this.sectionService.openSnackBar(this.totalGeoserver+" "+"nouvelles sections chargées avec succès","Ok");
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      });
  }

  createSectionGroup(section: Section): FormGroup {
    return this.fb.group({
      numero: [section.numero, Validators.compose([Validators.required])],
      numeroAncien: [section.numeroAncien],
      commune: [this.commune.id, Validators.compose([Validators.required])],
    });
  }

  supprimerSection(index: number) {

    const startIndex = this.pageIndex * this.pageSize;
    const sectionIndex = startIndex + index;
    /** Une suppression dans la liste datasourceSection paginée, implique une suppression de la meme
     valeur dans notre formulaire sectionAajouter ainsi que dans la liste des sections recupéré sur geoserver
     **/
    this.sections.splice(sectionIndex, 1);
    this.sectionAAjouter.removeAt(sectionIndex);
    this.dataSourceSection.data.splice(sectionIndex, 1);
    // Recalculer le total d'elements après suppression
    this.totalElements = this.sections.length;
    // Mettre à jour les données sources et du formulaire
    this.updateDataSource();
  }

  updateDataSource(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSourceSection.data = this.sections.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }

  applyFilter(filterValue: string) {
    this.dataSourceAllSection.filter = filterValue.trim().toLowerCase();

    // Mettre à jour la datasource paginée avec les résultats filtrés
    const filteredData = this.dataSourceAllSection.filteredData;
    this.dataSourceSection.data = filteredData.slice(0, this.pageSize); // adapter en fonction de la pagination
  }
  clearSearch(inputElement: HTMLInputElement) {
    this.filterValue = '';
    inputElement.value = '';
    this.applyFilter('');
  }

  sortSectionsByNumero(): void {
    this.sections.sort((a, b) => {
      return a.numero.localeCompare(b.numero, undefined, {numeric: true});
    });
  }

}
