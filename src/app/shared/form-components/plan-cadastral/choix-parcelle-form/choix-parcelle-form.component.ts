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
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { IlotService } from '@sycadApp/services/cession-parcelle/ilot.service';

import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';

import { RemoteAutocomplete, RemoteAutocompleteExtend } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { IlotItem,IlotElement, ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { Section } from '@sycadApp/models/data-references/contribuables/global.model';
import { Observable, of, Subject } from 'rxjs';
import { RemoteAutocompleteCommuneZoneCompetence } from '@sycadApp/features/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import { ArrondissementAutocomplete } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';




@Component({
  selector: 'app-choix-parcelle-form',
  templateUrl: './choix-parcelle-form.component.html',
  styleUrls: ['./choix-parcelle-form.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ChoixParcelleFormComponent), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class ChoixParcelleFormComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {


  @Input()
  touched: boolean;


  @Input("parcelleChoisie")
  parcelleChoisie: ParcelleElement;

  @Input("proprietaire")
  proprietaire: string;

  @Input("structure")
  structure: any;

  @Input("simpleContribuable")
  simpleContribuable: boolean;

  @Input("callbackAutocompleteParcelle")
  callbackAutocompleteParcelle:(search:string,params:Map<string,any>)=>Observable<any[]>;


  @Output("change")
  public change:  EventEmitter<ParcelleElement> = new EventEmitter<ParcelleElement>();

  public parcelleChoisieId: Number;
  public sectionChoisieId:number;
  public arrondissementChoisiId:number;
  public ilotChoisieId:number;
  public communeId:number;

  public parcelleRemoteAutocomplte = new RemoteAutocompleteExtend<ParcelleElement>();

  public communeRemoteAutocomplete;
  public sectionRemoteAutocomplete = new RemoteAutocomplete<Section>();
  public arrondissementRemoteAutocomplete = new RemoteAutocomplete<ArrondissementAutocomplete>();
  public ilotRemoteAutocomplete = new RemoteAutocomplete<IlotElement>();

  private _onDestroy = new Subject<void>();

  onChange: any = (_: Number) => {};

  onTouch: any = () => {};


  constructor(
    public communeService: CommunesService,
    public sectionService: SectionService,
    public arrondissementService: ArrondissementsService,
    public ilotService: IlotService,
  ) { }

  ngOnInit(): void {
    if(this.simpleContribuable) {
        this.communeRemoteAutocomplete=new RemoteAutocomplete<CommuneAutocomplete>();
    }else {
      this.communeRemoteAutocomplete=new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();
    }

   this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);

    if(this.parcelleChoisie && this.parcelleChoisie.id) {
      this.communeRemoteAutocomplete.listRessource$ = of([ this.parcelleChoisie?.arrondissement?.commune]);
      this.communeRemoteAutocomplete.initialList = [ this.parcelleChoisie?.arrondissement?.commune];
      this.communeId=this.parcelleChoisie?.arrondissement?.commune.id;
      
      this.arrondissementRemoteAutocomplete.params.set("commune",this.communeId);
      this.arrondissementRemoteAutocomplete.listRessource$ = of([ this.parcelleChoisie?.ilot?.arrondissement]);
      this.arrondissementRemoteAutocomplete.initialList = [ this.parcelleChoisie?.ilot?.arrondissement];
      this.arrondissementChoisiId=this.parcelleChoisie?.ilot?.arrondissement?.id;
      this.initArrondissement();

      this.sectionRemoteAutocomplete.params.set("commune",this.communeId);
      this.sectionRemoteAutocomplete.listRessource$ = of([ this.parcelleChoisie?.ilot?.section]);
      this.sectionRemoteAutocomplete.initialList = [ this.parcelleChoisie?.ilot?.section];
      this.sectionChoisieId=this.parcelleChoisie?.ilot?.section?.id;
      this.initSection();

      this.ilotRemoteAutocomplete.params.set("section",this.sectionChoisieId);
      this.ilotRemoteAutocomplete.params.set("arrondissement",this.arrondissementChoisiId);
      this.ilotRemoteAutocomplete.listRessource$ = of([ this.parcelleChoisie?.ilot]);
      this.ilotRemoteAutocomplete.initialList = [ this.parcelleChoisie?.ilot];
      this.ilotChoisieId=this.parcelleChoisie?.ilot?.id;
      this.initIlot();

      this.parcelleRemoteAutocomplte.params.set("ilot",this.ilotChoisieId);
      if(this.parcelleChoisie.id){
        this.parcelleRemoteAutocomplte.listRessource$ = of([ this.parcelleChoisie]);
        this.parcelleRemoteAutocomplte.initialList = [ this.parcelleChoisie];
      }

      this.initParcelle();
    }
  }

  public onSearchArrondissement($event){
    this.sectionRemoteAutocomplete.term.next($event.term);
  }

  public onChangeArrondissement(arrondissement: ArrondissementAutocomplete){
    if(arrondissement){
      this.initIlot();
      this.ilotChoisieId=null;
      this.parcelleChoisie=null;
      this.parcelleChoisieId=null;
      this.onChange(null);
  
      this.parcelleRemoteAutocomplte.listRessource$=of([])
      this.ilotRemoteAutocomplete.params.set("arrondissement",arrondissement?.id);

      if(this.sectionChoisieId){
        this.ilotRemoteAutocomplete.params.set("section", this.sectionChoisieId);
      }
      this.ilotRemoteAutocomplete.term.next("");
    } else {
      this.arrondissementChoisiId = null;
    }
  }

  public onSearchParcelle(eventNgSelect) {
    this.parcelleRemoteAutocomplte.term.next(eventNgSelect.term);
  }
  public clearSelectparcelle() {
   this.parcelleChoisie=null;
   this.parcelleChoisieId=null;
  }

  public onChangeParcelle(parcelle: ParcelleElement) {
    this.parcelleChoisie = parcelle;
    this.parcelleChoisie.dateEtatMev = parcelle["delaiDeMiseEnValeur"];
    
    this.onChange(parcelle.id);
    this.change.emit(parcelle);
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['touched'] && simpleChanges['touched'].currentValue) {
    }
  }

  writeValue(id: null | Number): void {

    this.parcelleChoisieId=id;
   if(id===null) {
       this.communeId=null;
       this.sectionChoisieId=null;
       this.arrondissementChoisiId=null;
       this.ilotChoisieId=null;

       this.ilotRemoteAutocomplete.listRessource$=of([]);
       this.sectionRemoteAutocomplete.listRessource$=of([]);
       this.arrondissementRemoteAutocomplete.listRessource$=of([]);
       this.parcelleRemoteAutocomplte.listRessource$=of([]);
       this.parcelleRemoteAutocomplte.initialList=[];
       this.parcelleChoisie=null;
       this.parcelleRemoteAutocomplte.resetParams();
       this.ilotRemoteAutocomplete.resetParams();
       this.sectionRemoteAutocomplete.resetParams();
       this.arrondissementRemoteAutocomplete.resetParams();
   }
      //on laisse commune, ilot, section init et parcelle au choix
      if(id===-99) {

        this.parcelleChoisieId=null;
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

  initArrondissement() {
    if(!this.arrondissementRemoteAutocomplete.init) {
      this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementService);
      this.arrondissementRemoteAutocomplete.mapFunction=(arrondissement: ArrondissementAutocomplete)=>{
        return arrondissement;
      }
    }
  }

  public onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
  }


  public onChangeCommune(commune:CommuneAutocomplete) {

    this.initSection();
    this.initArrondissement();
    this.sectionChoisieId=null;
    this.arrondissementChoisiId=null;
    this.ilotChoisieId=null;
    this.parcelleChoisie=null;
    this.parcelleChoisieId=null;
    this.onChange(null);

   this.parcelleRemoteAutocomplte.listRessource$=of([])
   this.ilotRemoteAutocomplete.listRessource$=of([])

   this.sectionRemoteAutocomplete.params.set("commune",commune?.id);
   this.sectionRemoteAutocomplete.term.next("");

   this.arrondissementRemoteAutocomplete.params.set("commune",commune?.id);
   this.arrondissementRemoteAutocomplete.term.next("");
  }


  public onSearchIlot(eventNgSelect) {
    this.ilotRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  initParcelle(){
    if(!this.parcelleRemoteAutocomplte.init) {

      this.parcelleRemoteAutocomplte.callbackAutocomplete=this.callbackAutocompleteParcelle;

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
    if(section){
      this.initIlot();
      this.ilotChoisieId=null;
      this.parcelleChoisie=null;
      this.parcelleChoisieId=null;
      this.onChange(null);

      this.parcelleRemoteAutocomplte.listRessource$=of([])
      this.ilotRemoteAutocomplete.params.set("section",section?.id);
      if(this.arrondissementChoisiId){
        this.ilotRemoteAutocomplete.params.set("arrondissement", this.arrondissementChoisiId);
      }
      this.ilotRemoteAutocomplete.term.next("");
    } else {
      this.sectionChoisieId = null;
    }
  }

}
