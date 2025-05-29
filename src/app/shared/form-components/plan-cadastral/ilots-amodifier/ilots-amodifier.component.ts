import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {IlotElement, IlotItem, ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';
import {RemoteAutocomplete} from '@sycadShared/form-components/model/remote-autocomplete';
import {Section} from '@sycadApp/models/data-references/contribuables/global.model';
import {MatTableDataSource} from '@angular/material/table';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {AbstractControl, ControlValueAccessor, FormArray, FormBuilder, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {CommunesService} from '@sycadApp/services/data-references/territoire/communes.service';
import {SectionService} from '@sycadApp/services/cession-parcelle/section.service';
import {IlotService} from '@sycadApp/services/cession-parcelle/ilot.service';
import {CommuneAutocomplete} from '@sycadApp/models/data-references/territoire/commune.model';
import {RemoteAutocompleteCommuneZoneCompetence} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';

@Component({
  selector: 'app-ilots-amodifier',
  templateUrl: './ilots-amodifier.component.html',
  styleUrls: ['./ilots-amodifier.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => IlotsAModifierComponent), multi: true }]
})
export class IlotsAModifierComponent implements  ControlValueAccessor, OnInit, OnDestroy, OnChanges {
  @Input()
  touched: boolean;

  @Input('formGroup')
  ilotsAModifier: FormArray;

  @Input('ilotsChoisie')
  ilotsChoisie: IlotElement[];

  @Input('simpleContribuable')
  simpleContribuable: boolean;

  @Input('majPlan')
  majPlan: boolean;

  @Input('numero')
  numero: boolean;

  @Output('change')
  public change: EventEmitter<IlotElement[]> = new EventEmitter<IlotElement[]>();


  public ilotsChoisieIdIlotM: Number[];
  public sectionChoisieIdIlotM:number;
  public communeIdIlotM:number;

  public communeRemoteAutocomplete;
  public sectionRemoteAutocomplete = new RemoteAutocomplete<Section>();
  public ilotRemoteAutocomplete = new RemoteAutocomplete<IlotElement>();
  public dataSourceIlots = new MatTableDataSource<IlotElement>();
  public dataSource = new BehaviorSubject<AbstractControl[]>([]);
  public displayedColumns: string[] = ['numero', 'numeroAncien', 'action'];
  public lIlots: any = [];

  private _onDestroy = new Subject<void>();

  onChange: any = (_: Number) => {};

  onTouch: any = () => {};

  constructor(public communeService: CommunesService,
              public sectionService: SectionService,
              public ilotService: IlotService,
              private fb: FormBuilder) { }

  ngOnInit(): void {

    if(this.simpleContribuable) {
      this.communeRemoteAutocomplete = new RemoteAutocomplete<CommuneAutocomplete>();
    }else {
      this.communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();
    }

    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);

    if (this.ilotsChoisie && this.ilotsChoisie.length > 0) {

      this.communeRemoteAutocomplete.listRessource$ = of([ this.ilotsChoisie[0]?.section.commune]);
      this.communeRemoteAutocomplete.initialList = [ this.ilotsChoisie[0]?.section.commune];
      this.communeIdIlotM = this.ilotsChoisie[0]?.section.commune.id;

      this.sectionRemoteAutocomplete.params.set("commune",this.communeIdIlotM);
      this.sectionRemoteAutocomplete.listRessource$ = of([ this.ilotsChoisie[0]?.section]);
      this.sectionRemoteAutocomplete.initialList = [ this.ilotsChoisie[0]?.section];
      this.sectionChoisieIdIlotM = this.ilotsChoisie[0]?.section.id;
      this.initSection();

      this.ilotRemoteAutocomplete.params.set("section",this.sectionChoisieIdIlotM);
      this.ilotRemoteAutocomplete.listRessource$ = of( this.ilotsChoisie);
      this.ilotRemoteAutocomplete.initialList = this.ilotsChoisie;
      this.initIlot();
      this.lIlots = this.lIlots.concat(this.ilotsChoisie);
      this.ilotsChoisie.map((ilot) => {
        this.ilotsAModifier.insert(0, this.createIlot(ilot));
        this.updateTableIlot();
      });

    }
  }


  public onChangeIlot(ilots) {
    let tabilo = [];
    let ilo = null;
    if (ilots.length > 0) {
      this.dataSource = new BehaviorSubject<AbstractControl[]>([]);
      this.ilotsChoisie = ilots;
      ilo = ilots[ilots.length - 1];
      tabilo  = this.ilotsAModifier.value.filter(x => x.id === ilo?.id);
      if (tabilo.length === 0) {
        this.ilotsAModifier.insert(0, this.createIlot(ilo));
        this.updateTableIlot();
        this.onChange(ilots.map(ilot => ilot.id));
        this.change.emit(ilots);
      } else {
        this.updateTableIlot();
      }
    } else {
      this.updateTableIlot();

    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['touched'] && simpleChanges['touched'].currentValue) {
      // this.parcelleForm.markAllAsTouched();
    }
  }

  writeValue(id: null | Number[]): void {
    this.ilotsChoisieIdIlotM = id;
    if (id === null) {
      this.communeIdIlotM = null;
      this.sectionChoisieIdIlotM = null;

      this.ilotRemoteAutocomplete.listRessource$ = of([]);
      this.sectionRemoteAutocomplete.listRessource$ = of([]);
      this.ilotsChoisie = null;
      this.dataSource = null;
      this.ilotRemoteAutocomplete.resetParams();
      this.sectionRemoteAutocomplete.resetParams();
    }

  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: Number) => {}): void {
    this.onTouch = fn;
  }

  updateIlotFilter() {
    this.ilotRemoteAutocomplete.params.set('section', this.sectionChoisieIdIlotM);
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

  public onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
  }


  public onChangeCommune(commune: CommuneAutocomplete) {

    this.initSection();
    this.sectionChoisieIdIlotM = null;
    this.ilotsChoisie = null;
    this.ilotsChoisieIdIlotM = null
    // this.onChange(null);
    this.ilotRemoteAutocomplete.listRessource$=of([])
    this.sectionRemoteAutocomplete.params.set("commune",commune?.id);
    this.sectionRemoteAutocomplete.term.next("");
  }

  public onSearchIlot(eventNgSelect) {
    this.ilotRemoteAutocomplete.term.next(eventNgSelect.term);
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
    this.updateIlotFilter();
  }

  public onSearchSection(eventNgSelect) {
    this.sectionRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onChangeSection(section: Section) {
    this.initIlot();
    this.ilotsChoisieIdIlotM=null;
    // this.onChange(null);
    this.ilotRemoteAutocomplete.params.set("section",section?.id);
    this.ilotRemoteAutocomplete.term.next("");
  }

  ngOnDestroy() {

    this._onDestroy.next();
    this._onDestroy.complete();
    if (this.dataSource) {
      this.addNewIlot();
    }
  }

  createIlot(ilot: IlotElement=null) {

    if(ilot == null) {
      return this.fb.group({
        id: [null],
        numero: [null],
        numeroAncien: [{value: null}],
        // section: [null, Validators.compose([Validators.required])],
      });
    }else {
      return this.fb.group({
        id: [ilot.id],
        numero: [ilot.numero],
        numeroAncien: [ilot.numeroAncien],
        // section: [ilot.section.id, Validators.compose([Validators.required])],
      });
    }

  }
  addNewIlot(ilot: IlotElement = null) {
    this.ilotsAModifier.insert(0, this.createIlot(ilot));
    this.updateTableIlot();
  }

  public supprimerIlot(index){
    this.ilotsAModifier.removeAt(index);
    this.lIlots.splice(index, 1);
    this.updateTableIlot();
  }

  public updateTableIlot() {
    this.dataSource.next(this.ilotsAModifier.controls);
  }

}
