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
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {CommunesService} from '@sycadApp/services/data-references/territoire/communes.service';
import {SectionService} from '@sycadApp/services/cession-parcelle/section.service';
import {IlotService} from '@sycadApp/services/cession-parcelle/ilot.service';
import {ControlValueAccessor, FormArray, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {IlotElement, IlotItem, ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';
import {RemoteAutocomplete, RemoteAutocompleteExtend} from '@sycadShared/form-components/model/remote-autocomplete';
import {Section} from '@sycadApp/models/data-references/contribuables/global.model';
import {Observable, of, Subject} from 'rxjs';
import {CommuneAutocomplete} from '@sycadApp/models/data-references/territoire/commune.model';
import {RemoteAutocompleteCommuneZoneCompetence} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-parcelle-form-fusion',
  templateUrl: './parcelle-form-fusion.component.html',
  styleUrls: ['./parcelle-form-fusion.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ParcelleFormFusionComponent), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class ParcelleFormFusionComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
  @Input()
  touched: boolean;

  @Input('parcelleChoisie')
  parcelleChoisie: ParcelleElement[];

  @Input('proprietaire')
  proprietaire: string;

  @Input('structure')
  structure: any;

  @Input('simpleContribuable')
  simpleContribuable: boolean;


  @Input("callbackAutocompleteParcelle") 
  callbackAutocomplete:(search:string,params:Map<string,any>)=>Observable<any[]>;



  @Output('change')
  public change: EventEmitter<ParcelleElement[]> = new EventEmitter<ParcelleElement[]>();

  public parcelleChoisieId: Number[];
  public sectionChoisieId:number;
  public ilotChoisieId:number;
  public communeId:number;

  public parcelleRemoteAutocomplte = new RemoteAutocompleteExtend<ParcelleElement>();

  public communeRemoteAutocomplete;
  public sectionRemoteAutocomplete = new RemoteAutocomplete<Section>();
  public ilotRemoteAutocomplete = new RemoteAutocomplete<IlotElement>();
  public dataSourceParcelles = new MatTableDataSource<ParcelleElement>();
  public displayedColumns: string[] = ['numero', 'numeroAncien', 'libelle', 'superficie', 'destination'];

  private _onDestroy = new Subject<void>();

  onChange: any = (_: Number) => {};

  onTouch: any = () => {};

  constructor(public parcelleService: ParcelleService,
              public communeService: CommunesService,
              public sectionService: SectionService,
              public ilotService: IlotService) { }

  ngOnInit(): void {

    if(this.simpleContribuable) {
      this.communeRemoteAutocomplete=new RemoteAutocomplete<CommuneAutocomplete>();
    }else {
      this.communeRemoteAutocomplete=new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();
    }

    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);


    if(this.parcelleChoisie && this.parcelleChoisie.length > 0) {
      this.communeRemoteAutocomplete.listRessource$ = of([ this.parcelleChoisie[0]?.arrondissement.commune]);
      this.communeRemoteAutocomplete.initialList = [ this.parcelleChoisie[0]?.arrondissement.commune];
      this.communeId=this.parcelleChoisie[0]?.arrondissement.commune.id;


      this.sectionRemoteAutocomplete.params.set("commune",this.communeId);
      this.sectionRemoteAutocomplete.listRessource$ = of([ this.parcelleChoisie[0]?.ilot.section]);
      this.sectionRemoteAutocomplete.initialList = [ this.parcelleChoisie[0]?.ilot.section];
      this.sectionChoisieId=this.parcelleChoisie[0]?.ilot.section.id;
      this.initSection();


      this.ilotRemoteAutocomplete.params.set("section",this.sectionChoisieId);
      this.ilotRemoteAutocomplete.listRessource$ = of([ this.parcelleChoisie[0]?.ilot]);
      this.ilotRemoteAutocomplete.initialList = [ this.parcelleChoisie[0]?.ilot];
      this.ilotChoisieId=this.parcelleChoisie[0]?.ilot.id;
      this.initIlot();

      this.parcelleRemoteAutocomplte.params.set("ilot",this.ilotChoisieId);
      this.parcelleRemoteAutocomplte.listRessource$ = of( this.parcelleChoisie);
      this.parcelleRemoteAutocomplte.initialList =  this.parcelleChoisie;
      this.initParcelle();



    }


  }

  public onSearchParcelle(eventNgSelect) {
    this.parcelleRemoteAutocomplte.term.next(eventNgSelect.term);
  }


  public onChangeParcelle(parcelles) {
    this.parcelleChoisie = parcelles;
    this.dataSourceParcelles = parcelles;
    this.onChange(parcelles.map(parcelle => parcelle.id));
    this.change.emit(parcelles);
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

  writeValue(id: null | Number[]): void {
    this.parcelleChoisieId = id;
    if (this.dataSourceParcelles) {
      this.dataSourceParcelles.data = this.parcelleChoisie;
    }
    if (id === null) {
      this.communeId=null;
      this.sectionChoisieId=null;
      this.ilotChoisieId=null;

      this.ilotRemoteAutocomplete.listRessource$=of([]);
      this.sectionRemoteAutocomplete.listRessource$=of([]);
      this.parcelleRemoteAutocomplte.listRessource$=of([]);
      this.parcelleRemoteAutocomplte.initialList=[];
      this.parcelleChoisie=null;
      this.dataSourceParcelles = null;
      this.parcelleRemoteAutocomplte.resetParams();
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




  updateParcelleFilter() {
    if(this.proprietaire) {
      this.parcelleRemoteAutocomplte.resetParams();
      this.parcelleRemoteAutocomplte.params.set("proprietaire", this.proprietaire);
    }

    if(this.structure) {
      this.parcelleRemoteAutocomplte.resetParams();
      this.parcelleRemoteAutocomplte.params.set("structure", this.structure);
    }
    this.parcelleRemoteAutocomplte.params.set("ilot",this.ilotChoisieId);
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
    this.sectionChoisieId=null;
    this.ilotChoisieId=null;
    this.parcelleChoisie=null;
    this.parcelleChoisieId=null;
    this.dataSourceParcelles = null;
    this.onChange(null);


    this.parcelleRemoteAutocomplte.listRessource$=of([])
    this.ilotRemoteAutocomplete.listRessource$=of([])
    this.sectionRemoteAutocomplete.params.set("commune",commune?.id);
    this.sectionRemoteAutocomplete.term.next("");
  }


  public onSearchIlot(eventNgSelect) {
    this.ilotRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  initParcelle(){
    if(!this.parcelleRemoteAutocomplte.init) {

      this.parcelleRemoteAutocomplte.callbackAutocomplete=this.callbackAutocomplete;
      
      this.parcelleRemoteAutocomplte.initializeRemoteAutocompletion(this._onDestroy);
      this.parcelleRemoteAutocomplte.mapFunction=(parcelle: ParcelleElement)=>{
        if(parcelle.numeroAncien) {
          parcelle.label=parcelle.numeroAncien+" - "+parcelle.numero;
        }
        return parcelle;
      }
    }
    this.updateParcelleFilter();
  }
  public onChangeIlot(ilot:IlotItem) {

    this.initParcelle();

    this.parcelleChoisie=null;
    this.parcelleChoisieId=null;
    this.dataSourceParcelles = null;
    this.parcelleRemoteAutocomplte.params.set("ilot",ilot?.id);
    this.parcelleRemoteAutocomplte.term.next("");
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
  }
  public onChangeSection(section: Section) {
    this.initIlot();
    this.ilotChoisieId=null;
    this.parcelleChoisie=null;
    this.parcelleChoisieId=null;
    this.dataSourceParcelles = null;
    this.onChange(null);

    this.parcelleRemoteAutocomplte.listRessource$=of([])
    this.ilotRemoteAutocomplete.params.set("section",section?.id);
    this.ilotRemoteAutocomplete.term.next("");
  }

}
