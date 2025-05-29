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
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {IlotElement, IlotItem, ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';
import {RemoteAutocomplete} from '@sycadShared/form-components/model/remote-autocomplete';
import {Section} from '@sycadApp/models/data-references/contribuables/global.model';
import {MatTableDataSource} from '@angular/material/table';
import {of, Subject} from 'rxjs';
import {CommuneAutocomplete} from '@sycadApp/models/data-references/territoire/commune.model';
import {RemoteAutocompleteCommuneZoneCompetence} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {CommunesService} from '@sycadApp/services/data-references/territoire/communes.service';
import {SectionService} from '@sycadApp/services/cession-parcelle/section.service';
import {IlotService} from '@sycadApp/services/cession-parcelle/ilot.service';

@Component({
  selector: 'app-ilots-adesactive-form',
  templateUrl: './ilots-adesactive-form.component.html',
  styleUrls: ['./ilots-adesactive-form.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => IlotsADesactiveFormComponent), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class IlotsADesactiveFormComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
  @Input()
  touched: boolean;

  @Input('ilotsChoisie')
  ilotsChoisie: IlotElement[];

  @Input('proprietaire')
  proprietaire: string;

  @Input('structure')
  structure: any;

  @Input('simpleContribuable')
  simpleContribuable: boolean;


  @Output('change')
  public change: EventEmitter<IlotElement[]> = new EventEmitter<IlotElement[]>();

  @Input('majPlan')
  majPlan: boolean;

  public ilotsChoisieIdIlot: Number[];
  public sectionChoisieIdIlot:number;
  public communeIdIlot:number;

  public communeRemoteAutocomplete;
  public sectionRemoteAutocomplete = new RemoteAutocomplete<Section>();
  public ilotRemoteAutocomplete = new RemoteAutocomplete<IlotElement>();
  public dataSourceIlots = new MatTableDataSource<IlotElement>();
  public displayedColumns: string[] = ['numero', 'numeroAncien', 'section', 'commune', 'action'];
  public lIlots: any = [];

  private _onDestroy = new Subject<void>();

  onChange: any = (_: Number) => {};

  onTouch: any = () => {};

  constructor(public parcelleService: ParcelleService,
              public communeService: CommunesService,
              public sectionService: SectionService,
              public ilotService: IlotService) { }

  ngOnInit(): void {
    if(this.simpleContribuable) {
      this.communeRemoteAutocomplete = new RemoteAutocomplete<CommuneAutocomplete>();
    }else {
      this.communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();
    }

    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);

    if(this.ilotsChoisie && this.ilotsChoisie.length > 0) {

      this.communeRemoteAutocomplete.listRessource$ = of([ this.ilotsChoisie[0]?.section.commune]);
      this.communeRemoteAutocomplete.initialList = [ this.ilotsChoisie[0]?.section.commune];
      this.communeIdIlot = this.ilotsChoisie[0]?.section.commune.id;

      this.sectionRemoteAutocomplete.params.set("commune",this.communeIdIlot);
      this.sectionRemoteAutocomplete.listRessource$ = of([ this.ilotsChoisie[0]?.section]);
      this.sectionRemoteAutocomplete.initialList = [ this.ilotsChoisie[0]?.section];
      this.sectionChoisieIdIlot = this.ilotsChoisie[0]?.section.id;
      this.initSection();

      this.ilotRemoteAutocomplete.params.set("section",this.sectionChoisieIdIlot);
      this.ilotRemoteAutocomplete.listRessource$ = of( this.ilotsChoisie);
      this.ilotRemoteAutocomplete.initialList = this.ilotsChoisie;
      this.initIlot();
      this.lIlots = this.lIlots.concat(this.ilotsChoisie);

    }
  }


  public onChangeIlot(ilots) {
    this.ilotsChoisie = ilots;
    this.lIlots = this.lIlots.concat(ilots);
    this.lIlots = this.getUnique(this.lIlots, 'id');
    this.dataSourceIlots = this.lIlots;
    this.onChange(this.lIlots.map(ilot => ilot.id));
    this.change.emit(this.lIlots);
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    //this.subscription.unsubscribe();
  }
  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['touched'] && simpleChanges['touched'].currentValue) {
      // this.parcelleForm.markAllAsTouched();
    }
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

  writeValue(id: null | Number[]): void {
    this.ilotsChoisieIdIlot = id;
    if (this.dataSourceIlots) {
      this.dataSourceIlots.data = this.ilotsChoisie;
    }
    if (id === null) {
      this.communeIdIlot=null;
      this.sectionChoisieIdIlot=null;
      this.ilotsChoisieIdIlot=null;

      this.ilotRemoteAutocomplete.listRessource$=of([]);
      this.sectionRemoteAutocomplete.listRessource$=of([]);
      this.ilotsChoisie = null;
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
  }

  public onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
  }


  public onChangeCommune(commune:CommuneAutocomplete) {

    this.initSection();
    this.sectionChoisieIdIlot=null;
    this.ilotsChoisieIdIlot=null;
    this.ilotsChoisie=null;
    this.ilotsChoisieIdIlot=null;
    // this.onChange(null);

    this.ilotRemoteAutocomplete.listRessource$=of([]);
    this.sectionRemoteAutocomplete.params.set("commune",commune?.id);
    this.sectionRemoteAutocomplete.term.next("");
  }


  public onSearchIlot(eventNgSelect) {
    this.ilotRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchSection(eventNgSelect) {
    this.sectionRemoteAutocomplete.term.next(eventNgSelect.term);
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
  public onChangeSection(section: Section) {
    this.initIlot();
    this.ilotsChoisieIdIlot=null;
    this.ilotsChoisieIdIlot=null;
    // this.dataSourceIlots = null;
    // this.onChange(null);
    this.ilotRemoteAutocomplete.params.set("section",section?.id);
    this.ilotRemoteAutocomplete.term.next("");
  }

  updateIlotFilter() {
    this.ilotRemoteAutocomplete.params.set("section",this.sectionChoisieIdIlot);
  }

  supprimerIlot(elm){
    this.lIlots = this.lIlots.filter(i => i !== elm);
    this.dataSourceIlots = this.lIlots;
    this.onChange(this.lIlots.map(ilot => ilot.id));
    this.change.emit(this.lIlots);
  }

}
