import {Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormArray, FormBuilder, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {IlotElement} from '@sycadApp/models/data-references/territoire/localite.model';
import {RemoteAutocomplete} from '@sycadShared/form-components/model/remote-autocomplete';
import {Section} from '@sycadApp/models/data-references/contribuables/global.model';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {CommuneAutocomplete} from '@sycadApp/models/data-references/territoire/commune.model';
import {CommunesService} from '@sycadApp/services/data-references/territoire/communes.service';
import {SectionService} from '@sycadApp/services/cession-parcelle/section.service';
import {RemoteAutocompleteCommuneZoneCompetence} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';

@Component({
  selector: 'app-sections-amodifier',
  templateUrl: './sections-amodifier.component.html',
  styleUrls: ['./sections-amodifier.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SectionsAModifierComponent), multi: true }]

})
export class SectionsAModifierComponent implements  ControlValueAccessor, OnInit, OnDestroy, OnChanges {

  @Input()
  touched: boolean;

  @Input('formGroup')
  sectionsAModifier: FormArray;

  @Input('sectionsChoisie')
  sectionsChoisie: Section[];

  @Input('simpleContribuable')
  simpleContribuable: boolean;

  @Input('majPlan')
  majPlan: boolean;

  @Input('numero')
  numero: boolean;

  @Output('change')
  public change: EventEmitter<Section[]> = new EventEmitter<Section[]>();

  public sectionChoisieIdIlotMo: Number[];
  public communeIdIlotMo: number;

  public communeRemoteAutocomplete;
  public sectionRemoteAutocomplete = new RemoteAutocomplete<Section>();
  public dataSource = new BehaviorSubject<AbstractControl[]>([]);
  public displayedColumns: string[] = ['numero', 'numeroAncien', 'action'];
  public lSections: any = [];

  private _onDestroy = new Subject<void>();

  onChange: any = (_: Number) => {};

  onTouch: any = () => {};

  constructor(public communeService: CommunesService,
              public sectionService: SectionService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    if(this.simpleContribuable) {
      this.communeRemoteAutocomplete = new RemoteAutocomplete<CommuneAutocomplete>();
    }else {
      this.communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();
    }

    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);

    if (this.sectionsChoisie && this.sectionsChoisie.length > 0) {

      this.communeRemoteAutocomplete.listRessource$ = of([ this.sectionsChoisie[0]?.commune]);
      this.communeRemoteAutocomplete.initialList = [ this.sectionsChoisie[0]?.commune];
      this.communeIdIlotMo = this.sectionsChoisie[0]?.commune.id;

      this.sectionRemoteAutocomplete.params.set('commune', this.communeIdIlotMo);
      this.sectionRemoteAutocomplete.listRessource$ = of( this.sectionsChoisie);
      this.sectionRemoteAutocomplete.initialList = this.sectionsChoisie;
      this.initSection();

      this.lSections = this.lSections.concat(this.sectionsChoisie);
      this.sectionsChoisie.map((ilot) => {
        this.sectionsAModifier.insert(0, this.createSection(ilot));
        this.updateTableSection();
      });

    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['touched'] && simpleChanges['touched'].currentValue) {
      // this.parcelleForm.markAllAsTouched();
    }
  }

  writeValue(id: null | Number[]): void {
    this.sectionChoisieIdIlotMo = id;
    if (id === null) {
      this.communeIdIlotMo = null;
      this.sectionChoisieIdIlotMo = null;
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

  updateSectionFilter() {
    this.sectionRemoteAutocomplete.params.set('commune', this.communeIdIlotMo);
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
    this.updateSectionFilter();
  }

  public onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
  }


  public onChangeCommune(commune: CommuneAutocomplete) {

    this.initSection();
    this.sectionChoisieIdIlotMo = null;
    this.sectionsChoisie = null;
    // this.onChange(null);
    this.sectionRemoteAutocomplete.params.set('commune', commune?.id);
    this.sectionRemoteAutocomplete.term.next('');
  }


  public onSearchSection(eventNgSelect) {
    this.sectionRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onChangeSection(sections) {

    let tabSec = [];
    let sec = null;
    if (sections.length > 0) {
      this.dataSource = new BehaviorSubject<AbstractControl[]>([]);
      this.sectionsChoisie = sections;
      sec = sections[sections.length - 1];
      tabSec  = this.sectionsAModifier.value.filter(x => x.id === sec?.id);
      if (tabSec.length === 0) {
        this.sectionsAModifier.insert(0, this.createSection(sec));
        this.updateTableSection();
        this.onChange(sections.map(section => section.id));
        this.change.emit(sections);
      } else {
        this.updateTableSection();
      }
    } else {
      this.updateTableSection();

    }

  }

  ngOnDestroy() {

    this._onDestroy.next();
    this._onDestroy.complete();
    if (this.dataSource) {
      this.addNewSection();
    }
  }

  createSection(section: Section=null) {

    if(section == null) {
      return this.fb.group({
        id: [null],
        numero: [null, Validators.compose([Validators.required])],
        numeroAncien: [ null],
        commune: [null, Validators.compose([Validators.required])]
      });
    } else {
      return this.fb.group({
        id: [section.id],
        numero: [section.numero, Validators.compose([Validators.required])],
        numeroAncien: [section.numeroAncien],
        commune: [section.commune?.id, Validators.compose([Validators.required])],
      });
    }

  }
  addNewSection(section: Section = null) {
    this.sectionsAModifier.insert(0, this.createSection(section));
    this.updateTableSection();
  }

  public supprimerSection(index){
    this.sectionsAModifier.removeAt(index);
    this.lSections.splice(index, 1);
    this.updateTableSection();
  }

  public updateTableSection() {
    this.dataSource.next(this.sectionsAModifier.controls);
  }
}
