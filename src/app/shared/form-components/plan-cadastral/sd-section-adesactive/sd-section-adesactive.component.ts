import {
  Component,
  EventEmitter, forwardRef,
  Input, OnChanges, OnDestroy, OnInit,
  Output, SimpleChanges, ViewEncapsulation
} from '@angular/core';
import {
  Section
} from "@sycadApp/models/data-references/contribuables/global.model";
import {
  RemoteAutocomplete
} from "@sycadShared/form-components/model/remote-autocomplete";
import {MatTableDataSource} from "@angular/material/table";
import {of, Subject} from "rxjs";
import {
  CommunesService
} from "@sycadApp/services/data-references/territoire/communes.service";
import {
  SectionService
} from "@sycadApp/services/cession-parcelle/section.service";
import {
  CommuneAutocomplete
} from "@sycadApp/models/data-references/territoire/commune.model";
import {
  RemoteAutocompleteCommuneZoneCompetence
} from "@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from "@angular/forms";

@Component({
  selector: 'app-sd-section-adesactive',
  templateUrl: './sd-section-adesactive.component.html',
  styleUrls: ['./sd-section-adesactive.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SdSectionAdesactiveComponent), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class SdSectionAdesactiveComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges{
  @Input()
  touched: boolean;

  @Input('sectionsChoisie')
  sectionsChoisie: Section[];

  @Input('proprietaire')
  proprietaire: string;

  @Input('structure')
  structure: any;

  @Input('simpleContribuable')
  simpleContribuable: boolean;

  @Input('communeAutocomplete')
  commune: CommuneAutocomplete;
  @Output('change')
  public change: EventEmitter<Section[]> = new EventEmitter<Section[]>();

  public sectionChoisieIdSection:Number[];
  public communeIdSection:number;

  public communeRemoteAutocomplete;
  public sectionRemoteAutocomplete = new RemoteAutocomplete<Section>();
  public dataSourceSections = new MatTableDataSource<Section>();
  public displayedColumns: string[] = ['numero', 'numeroAncien', 'commune', 'action'];
  public lSections: any = [];

  private _onDestroy = new Subject<void>();

  onChange: any = (_: Number) => {};

  onTouch: any = () => {};

  constructor(public communeService: CommunesService,
              public sectionService: SectionService) {
    this.dataSourceSections.data = [];
  }

  ngOnInit(): void {
    if(this.simpleContribuable) {
      this.communeRemoteAutocomplete = new RemoteAutocomplete<CommuneAutocomplete>();
    }else {
      this.communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();
    }

    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);


    if(this.sectionsChoisie && this.sectionsChoisie.length > 0) {
      this.communeRemoteAutocomplete.listRessource$ = of([ this.sectionsChoisie[0]?.commune]);
      this.communeRemoteAutocomplete.initialList = [ this.sectionsChoisie[0]?.commune];
      this.communeIdSection = this.sectionsChoisie[0]?.commune.id;


      this.sectionRemoteAutocomplete.params.set("commune",this.communeIdSection);
      //this.sectionRemoteAutocomplete.listRessource$ = of( this.sectionsChoisie);
      //this.sectionRemoteAutocomplete.initialList =  this.sectionsChoisie;
      this.initSection();
      this.lSections = this.lSections.concat(this.sectionsChoisie);

    }
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    //this.subscription.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['touched'] && changes['touched'].currentValue) {
      // this.parcelleForm.markAllAsTouched();
    }
    if(changes['commune'] && changes['commune'].currentValue){
      this.initSection();
      this.sectionChoisieIdSection=null;
      // this.dataSourceSections = null;
      // this.onChange(null);

      this.sectionRemoteAutocomplete.params.set("commune",this.commune?.id);
      this.sectionRemoteAutocomplete.term.next("");
    }

  }

  writeValue(id: null | Number[]): void {
    this.sectionChoisieIdSection = id;
    if (this.dataSourceSections) {
      this.dataSourceSections.data = this.sectionsChoisie;
    }
    if (id === null) {
      this.communeIdSection=null;
      this.sectionChoisieIdSection=null;
      this.sectionRemoteAutocomplete.listRessource$=of([]);
      this.sectionsChoisie = null;
      this.dataSourceSections = null;
      this.sectionRemoteAutocomplete.resetParams();
    }

  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: Number) => {}): void {
    this.onTouch = fn;
  }

  initSection() {
    if(!this.sectionRemoteAutocomplete.init) {
      this.sectionRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.sectionService);
      this.sectionRemoteAutocomplete.mapFunction=(section: Section)=>{
        if(section.numeroAncien) {
          section.libelle=section.numeroAncien+" - "+section.numero;
        }
        return section;
      }
    }
    this.updateSectiontFilter();
  }



  public onSearchSection(eventNgSelect) {
    this.sectionRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onChangeSection(sections) {
    this.sectionsChoisie = sections;
    this.lSections = this.lSections.concat(sections);
    this.lSections = this.getUnique(this.lSections, 'id');
    this.dataSourceSections = this.lSections;
    this.onChange(this.lSections.map(ilot => ilot.id));
    this.change.emit(this.lSections);
  }

  getUnique(arr, comp) {
    const unique = arr
      .map(e => e[comp])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter(e => arr[e])
      .map(e => arr[e]);
    return unique;
  }

  updateSectiontFilter() {
    this.sectionRemoteAutocomplete.params.set("section",this.communeIdSection);
  }

  supprimerSection(elm){
    this.lSections = this.lSections.filter(i => i !== elm);
    this.dataSourceSections = this.lSections;
    this.onChange(this.lSections.map(sec => sec.id));
    this.change.emit(this.lSections);
  }


}
