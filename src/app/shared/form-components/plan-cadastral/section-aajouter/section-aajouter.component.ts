import {Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormArray, FormBuilder, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {RemoteAutocomplete} from '@sycadShared/form-components/model/remote-autocomplete';
import {Section} from '@sycadApp/models/data-references/contribuables/global.model';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {CommunesService} from '@sycadApp/services/data-references/territoire/communes.service';
import {SectionService} from '@sycadApp/services/cession-parcelle/section.service';
import {CommuneAutocomplete, CommuneElement} from '@sycadApp/models/data-references/territoire/commune.model';
import {RemoteAutocompleteCommuneZoneCompetence} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';

@Component({
  selector: 'app-section-aajouter',
  templateUrl: './section-aajouter.component.html',
  styleUrls: ['./section-aajouter.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SectionAAjouterComponent), multi: true }],

})
export class SectionAAjouterComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {

  @Input()
  touched: boolean;

  @Input('formGroup')
  sectionAAjouter: FormArray;

  @Input('sectionsChoisie')
  sectionsChoisie: Section[];

  @Input('simpleContribuable')
  simpleContribuable: boolean;

  @Output('change')
  public change: EventEmitter<Section[]> = new EventEmitter<Section[]>();

  public communeIdSectionA: Number;

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

    if (this.simpleContribuable) {
      this.communeRemoteAutocomplete = new RemoteAutocomplete<CommuneAutocomplete>();
    } else {
      this.communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();
    }

    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    if (this.sectionsChoisie && this.sectionsChoisie.length > 0) {

      this.communeRemoteAutocomplete.listRessource$ = of([ this.sectionsChoisie[0]?.commune]);
      this.communeRemoteAutocomplete.initialList = [ this.sectionsChoisie[0]?.commune];
      this.communeIdSectionA = this.sectionsChoisie[0]?.commune.id;

      this.lSections = this.lSections.concat(this.sectionsChoisie);
      this.sectionsChoisie.map((section) => {
        this.sectionAAjouter.insert(0, this.createSection(section));
        this.updateTableSection();
      });

    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['touched'] && simpleChanges['touched'].currentValue) {
      // this.parcelleForm.markAllAsTouched();
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
    if (this.dataSource) {
      this.addNewSection();
    }
  }


  public onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
  }


  public onChangeCommune(commune: CommuneAutocomplete) {
    this.communeIdSectionA = commune.id;
    this.sectionsChoisie = null;
    this.onChange(null);
    this.sectionRemoteAutocomplete.params.set('commune', commune?.id);
    this.sectionRemoteAutocomplete.term.next('');
  }

  createSection(section: Section = null) {

    if (section == null) {
      return this.fb.group({
        id: [null, ],
        numero: [null, Validators.compose([Validators.required])],
        numeroAncien: [null],
        commune: this.communeIdSectionA
      });
    } else {
      return this.fb.group({
        id: [section.id],
        numero: [section.numero,  Validators.compose([Validators.required])],
        numeroAncien: [section.numeroAncien],
        commune: this.communeIdSectionA
      });
    }

  }
  addNewSection(section: Section = null) {
    this.sectionAAjouter.insert(0, this.createSection(section));
    this.updateTableSection();
  }

  public supprimerSection(index){
    this.sectionAAjouter.removeAt(index);
    this.lSections.splice(index, 1);
    this.updateTableSection();
  }

  public updateTableSection() {
    this.dataSource.next(this.sectionAAjouter.controls);
  }

}
