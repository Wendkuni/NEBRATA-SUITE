import { Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Section } from '@sycadApp/models/data-references/contribuables/global.model';
import { SdSectionnementElement } from '@sycadApp/models/workflow/sd-sectionnement.model';
import { RemoteAutocomplete } from '../../model/remote-autocomplete';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { RemoteAutocompleteCommuneZoneCompetence } from '@sycadApp/features/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import { SycadUtils } from '@sycadApp/shared/utils.functions';
import {MatSort} from "@angular/material/sort";
import {
  AppConfirmService
} from "@sycadShared/app-confirm/app-confirm.service";

@Component({
  selector: 'app-sd-sectionrecup-aajouter',

  templateUrl: './sd-sectionrecup-aajouter.component.html',
  styleUrls: ['./sd-sectionrecup-aajouter.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SdSectionrecupAajouterComponent),
    multi: true
  }],
})
export class SdSectionrecupAajouterComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges{
  @Input()
  touched: boolean;
  @ViewChild(MatSort) sort: MatSort;

  @Input('formGroup')
  sectionAAjouter: FormArray;

  @Input('sectionsChoisie')
  sectionsChoisie: Section[];

  @Input('simpleContribuable')
  simpleContribuable: boolean;

  @Input('live')
  live: boolean;

  @Output('change')
  public change: EventEmitter<Section[]> = new EventEmitter<Section[]>();

  @Input()
  public sdSectionnementElement: SdSectionnementElement;

  @Input()
  public loadingEvent:  EventEmitter<Boolean> = new EventEmitter<Boolean>();
  @Input('communeAutocomplete')
  commune: CommuneAutocomplete;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  sections: Section[] = [];
  public communeIdSectionA: Number;

  public communeRemoteAutocomplete;
  public sectionRemoteAutocomplete = new RemoteAutocomplete<Section>();
  public dataSource = new BehaviorSubject<AbstractControl[]>([]);
  public displayedColumns: string[] = [ 'numero', 'numeroAncien','commune', 'action'];
  public lSections: any = [];
  dataSourceSection = new MatTableDataSource<Section>([]);
  dataSourceAllSection = new MatTableDataSource<Section>([]);
  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;
  totalGeoserver = 0;

  private _onDestroy = new Subject<void>();

  onChange: any = (_: Number) => {
  };

  onTouch: any = () => {
  };

  constructor(public communeService: CommunesService,
              public confirmService:AppConfirmService,
              public sectionService: SectionService,
              private fb: FormBuilder, public _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {

    if (this.simpleContribuable) {
      this.communeRemoteAutocomplete = new RemoteAutocomplete<CommuneAutocomplete>();
    } else {
      this.communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();
    }

    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    if (this.sectionsChoisie && this.sectionsChoisie.length > 0) {

      this.communeRemoteAutocomplete.listRessource$ = of([this.sectionsChoisie[0]?.commune]);
      this.communeRemoteAutocomplete.initialList = [this.sectionsChoisie[0]?.commune];
      this.communeIdSectionA = this.sectionsChoisie[0]?.commune.id;

      this.lSections = this.lSections.concat(this.sectionsChoisie);
      this.sectionsChoisie.map((section) => {
        this.sectionAAjouter.insert(0, this.createSection(section));
        this.dataSourceAllSection.data = this.sectionsChoisie;
      });
      this.sections = this.sectionsChoisie;
      this.sortSectionsByNumero();
      this.totalElements = this.sections.length;
      this.updateDataSource();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const data = {title: "Confirmation",
      message: "Attention! La commune contient déjà des sections\n\n" +
        "Si vous continuez, les données seront perdues!\n\n" +
        "Voulez-vous vraiment continuer ?"}
    if (changes['commune'] && changes['commune'].currentValue) {
      if (this.commune != this.sdSectionnementElement.commune){
      //   this.confirmService.confirm(data)
      // .subscribe(($choix)=> {
      //     if($choix===true) {
      //
      //     }else {
      //       changes['commune'].currentValue = this.sdSectionnementElement.commune;
      //       this.commune = this.sdSectionnementElement.commune;
      //       console.log("Commune remis = ",changes['commune'].currentValue);
      //     }
      //     });
        this.sections = [];
        this.sectionAAjouter.controls = [];
        this.sectionsChoisie = [];
        this.totalElements = 0;
        this.dataSourceSection.data = [];
      }else {
        this.sections = [];
        this.sectionAAjouter.controls = [];
        this.sections = this.sdSectionnementElement.sectionsAAjouter;
        this.totalElements = this.sections.length;
        this.updateDataSource();
      }
    } else {
      this.sections = [];
      this.sectionAAjouter.controls = [];
      this.totalElements = 0;
      this.sectionsChoisie = [];
      this.dataSourceSection.data = [];

    }
  }

  writeValue(id: null | Number): void {
    this.communeIdSectionA = id;
    if (id === null) {
      this.communeIdSectionA = null;
      this.sectionRemoteAutocomplete.listRessource$ = of([]);
      this.sectionsChoisie = null;
      this.dataSource = null;
      this.sectionRemoteAutocomplete.resetParams();
    }

  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: Number) => {}): void {
    this.onTouch = fn;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    // if (this.dataSource) {
    //   this.addNewSection();
    // }
  }

  createSection(section: Section = null) {
    if (this.live) {
      if (section == null) {
        return this.fb.group({
          id: [null,],
          numeroAncien: [null],
          commune: [null, Validators.compose([Validators.required])]
        });
      } else {
        return this.fb.group({
          id: [section.id],
          numeroAncien: [section?.numeroAncien],
          commune: [this.commune?.id, Validators.compose([Validators.required])]
        });
      }
    } else {
      if (section == null) {
        return this.fb.group({
          id: [null,],
          numero: [null, Validators.compose([Validators.required])],
          numeroAncien: [null],
          commune: [null, Validators.compose([Validators.required])]
        });
      } else {
        return this.fb.group({
          id: [section.id],
          numero: [section?.numero, Validators.compose([Validators.required])],
          numeroAncien: [section?.numeroAncien],
          commune: [this.commune?.id, Validators.compose([Validators.required])]
        });
      }
    }


  }

  addNewSection(section: Section = null) {
    this.sectionAAjouter.insert(0, this.createSection(section));
  }

  public supprimerSection(index) {
    const startIndex = this.pageIndex * this.pageSize;
    const sectionIndex = startIndex + index;

    if (typeof this.sections[sectionIndex].id === "number"){
      const idSection = this.sections[sectionIndex].id;
      this.sectionService.removeSectionById(idSection, this.sdSectionnementElement.numero).subscribe(() => {
        this.sectionsChoisie = this.sectionsChoisie.filter(section => section.id !== idSection);
      });
    }
    this.sections.splice(sectionIndex, 1);
    this.dataSourceSection.data.splice(index, 1);
    // Recalculer le total d'elements après suppression
    this.totalElements = this.sections.length;
    // Mettre à jour les données sources et du formulaire
    this.sectionAAjouter.controls = [];
    this.sections.forEach(sectionn=>{
      this.sectionAAjouter.insert(0,this.createSection(sectionn))
    });
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

  initializeForm() {
    this.sections = [];
    this.sectionAAjouter.controls = [];
    this.dataSourceSection.data = [];
    this.totalElements = 0;
    // this.updateDataSource();
    this.loadingEvent.emit(true);
    if (this.commune === this.sdSectionnementElement.commune){
      this.sections = this.sdSectionnementElement.sectionsAAjouter;
    }
    this.getSection();
  }

  sectionExists(sectionToCheck: Section): boolean {
    return this.sectionAAjouter.controls.some((sectionGroup: FormGroup) => {
      const section = sectionGroup.value;
      return section.numero === sectionToCheck.numero ;
    });
  }
  applyFilter(filterValue: string) {
    this.dataSourceAllSection.filter = filterValue.trim().toLowerCase();

    // Mettre à jour la datasource paginée avec les résultats filtrés
    const filteredData = this.dataSourceAllSection.filteredData;
    this.dataSourceSection.data = filteredData.slice(0, this.pageSize); // adapter en fonction de la pagination
  }

  sortSectionsByNumero(): void {
    this.sections.sort((a, b) => {
      return a.numero.localeCompare(b.numero, undefined, { numeric: true });
    });
  }

  getSection(){
    this.loadingEvent.emit(true);
    if(this.commune === null || this.commune === undefined){
      this.loadingEvent.emit(false);
      this.sectionService.openSnackBar("Aucune commune selectionnée.Veuillez choisir la commune avant de charcger!","Ok");
    }
    this.sectionService.getSectionsByCodeCommune(this.commune.code).subscribe(data => {
        // this.sections.push(...data);
      this.sections = [...data,...this.sections];
      this.totalGeoserver = data.length;
        this.totalElements = this.sections.length;
        this.sections.forEach(section => {
          this.addNewSection(section);
          this.loadingEvent.emit(false);
        });
        this.sortSectionsByNumero();
        this.updateDataSource();
        this.sectionService.openSnackBar(this.totalGeoserver+" "+"nouvelles sections chargées depuis geoserver","Ok");
      },
      errorResponse => {
        this.loadingEvent.emit(false);
        SycadUtils.notifyRemoteError(errorResponse.error, this._snackBar);
      });
  }

}
