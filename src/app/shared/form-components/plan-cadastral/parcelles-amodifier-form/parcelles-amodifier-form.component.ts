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
import {IlotElement, IlotItem, LocaliteAutocomplete, ParcelleElement} from '@sycadApp/models/data-references/territoire/localite.model';
import {RemoteAutocomplete, RemoteAutocompleteExtend} from '@sycadShared/form-components/model/remote-autocomplete';
import {Section} from '@sycadApp/models/data-references/contribuables/global.model';
import {MatTableDataSource} from '@angular/material/table';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {ParcelleService} from '@sycadApp/services/cession-parcelle/parcelle.service';
import {CommunesService} from '@sycadApp/services/data-references/territoire/communes.service';
import {SectionService} from '@sycadApp/services/cession-parcelle/section.service';
import {IlotService} from '@sycadApp/services/cession-parcelle/ilot.service';
import {CommuneAutocomplete} from '@sycadApp/models/data-references/territoire/commune.model';
import {
  RemoteAutocompleteArrondissementZoneCompetence,
  RemoteAutocompleteCommuneZoneCompetence,
  RemoteAutocompleteZoneArrondissementCompetence
} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import {AbstractControl, ControlValueAccessor, FormArray, FormBuilder, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DateAdapter} from '@angular/material/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {DestinationParcelle} from '@sycadApp/models/bornage/destinationParcelle.model';
import {Quartier} from '@sycadApp/models/data-references/territoire/quartier.model';
import {LocaliteService} from '@sycadApp/services/data-references/territoire/localite.service';
import {ArrondissementZoneService} from '@sycadApp/services/data-references/territoire/arrondissement-zone.service';
import {DestinationParcelleService} from '@sycadApp/services/bornage/destination-parcelle.service';
import {QuartierService} from '@sycadApp/services/data-references/territoire/quartier.service';
import {ArrondissementAutocomplete, ArrondissementElement, ArrondissementZone} from '@sycadApp/models/data-references/territoire/arrondissement.model';
import {ArrondissementsService} from '@sycadApp/services/data-references/territoire/arrondissements.service';

@Component({
  selector: 'app-parcelles-amodifier-form',
  templateUrl: './parcelles-amodifier-form.component.html',
  styleUrls: ['./parcelles-amodifier-form.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ParcellesAModifierFormComponent), multi: true }],
})
export class ParcellesAModifierFormComponent implements  ControlValueAccessor, OnInit, OnDestroy, OnChanges {

 @Input()
  touched: boolean;

  @Input('formGroup')
  parcellesAModifier: FormArray;

  @Input('parcelleChoisie')
  parcelleChoisie: ParcelleElement[];

  @Input('proprietaire')
  proprietaire: string;

  @Input('structure')
  structure: any;

  @Input('simpleContribuable')
  simpleContribuable: boolean;

  @Input('majPlan')
  majPlan: boolean;

  @Input('numero')
  numero: boolean;

  @Input("callbackAutocompleteParcelle")
  callbackAutocomplete: (search:string,params:Map<string,any>)=>Observable<any[]>;

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

  public destinationRemoteAutocomplete = new RemoteAutocomplete<DestinationParcelle>();
  public quartierRemoteAutocomplete = new RemoteAutocomplete<Quartier>();
  public localiteRemoteAutocomplete = new RemoteAutocomplete<LocaliteAutocomplete>();
  public arrondissementRemoteAutocomplete;
  public arrondissementZoneRemoteAutocomplete=new RemoteAutocompleteZoneArrondissementCompetence<ArrondissementZone>();


  groupByFnArrondissement = (item) => item.commune.nom;
  groupValueFnArrondissement = (_: string, communes: any[]) => ({ name: communes[0].commune.nom, total: communes.length });
  

  
  public dataSource = new BehaviorSubject<AbstractControl[]>([]);

  private _onDestroy = new Subject<void>();

  public lParcelles: any = [];

  onChange: any = (_: Number) => {};

  onTouch: any = () => {};

  constructor(public parcelleService: ParcelleService,
              public communeService: CommunesService,
              public sectionService: SectionService,
              public ilotService: IlotService,
              private fb: FormBuilder,
              public _snackBar: MatSnackBar,
              public _adapter: DateAdapter<any>,
              private mediaObserver: MediaObserver,
              public localiteService: LocaliteService,
              public destinationParcelleService: DestinationParcelleService,
              public quartierService: QuartierService,
              public arrondissementService: ArrondissementsService,
              public zoneService: ArrondissementZoneService) { }

  public activeMediaQuery = '';

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  ngOnInit(): void {

  
    
    if (this.simpleContribuable) {
      this.communeRemoteAutocomplete = new RemoteAutocomplete<CommuneAutocomplete>();
      this.arrondissementRemoteAutocomplete=new RemoteAutocomplete<ArrondissementAutocomplete>();
    } else {
      this.communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();
      this.arrondissementRemoteAutocomplete= new RemoteAutocompleteArrondissementZoneCompetence<ArrondissementAutocomplete>();
    }

    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementService);


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

      this.lParcelles = this.lParcelles.concat(this.parcelleChoisie);

      this.parcelleChoisie.map((parcelle) => {

        this.destinationRemoteAutocomplete.listRessource$ = of([parcelle?.destination]);
        this.destinationRemoteAutocomplete.initialList = [parcelle?.destination];

        this.localiteRemoteAutocomplete.listRessource$ = of([parcelle?.localite]);
        this.localiteRemoteAutocomplete.initialList = [parcelle?.localite];
        this.localiteRemoteAutocomplete.params.set('arrondissement', parcelle?.arrondissement.id);
        this.localiteRemoteAutocomplete.term.next("");
        if (parcelle.quartier) {
          this.quartierRemoteAutocomplete.listRessource$ = of([parcelle?.quartier]);
          this.quartierRemoteAutocomplete.initialList = [parcelle?.quartier];
        }
        this.quartierRemoteAutocomplete.params.set("commune", parcelle?.arrondissement?.commune?.id);

        this.quartierRemoteAutocomplete.term.next("");
        if (parcelle.zone) {
          this.arrondissementZoneRemoteAutocomplete.listRessource$ = of([parcelle?.zone]);
          this.arrondissementZoneRemoteAutocomplete.initialList = [parcelle?.zone];
        }

        this.arrondissementZoneRemoteAutocomplete.params.set("arrondissement", parcelle?.arrondissement?.id);
        this.arrondissementZoneRemoteAutocomplete.term.next("");

        this.arrondissementRemoteAutocomplete.params.set("commune", parcelle?.arrondissement?.commune?.id);
        this.arrondissementRemoteAutocomplete.term.next("");

        this.parcellesAModifier.insert(0, this.createParcelle(parcelle));
        this.updateTableParcelle();
      });
     
    }


    this.destinationRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.destinationParcelleService);
    this.quartierRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.quartierService);
    this.localiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.localiteService);
    this.arrondissementZoneRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.zoneService);
  }

  displayedColumns: string[] = ['numero', 'numeroAncien', 'libelle', 'superficie', 'destination','arrondissement', 'quartier', 'localite', 'zone',  'action'];


  public onSearchParcelle(eventNgSelect) {
    this.parcelleRemoteAutocomplte.term.next(eventNgSelect.term);
  }

  public onSearchArrondissement(eventNgSelect) {
    this.arrondissementRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchDestination(eventNgSelect){
    this.destinationRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchQuartier(eventNgSelect){
    this.quartierRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchLocalite(eventNgSelect){
    this.localiteRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onChangeParcelle(parcelles) {

    let tabPa = [];
    let pa = null;
    if (parcelles.length > 0) {

      this.dataSource = new BehaviorSubject<AbstractControl[]>([]);
      this.parcelleChoisie = parcelles;
      pa = parcelles[parcelles.length - 1];
      tabPa  = this.parcellesAModifier.value.filter(x => x.id === pa?.id);
      if (tabPa.length === 0) {
        this.destinationRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.destinationParcelleService);
        this.destinationRemoteAutocomplete.listRessource$ = of([pa?.destination]);
        this.destinationRemoteAutocomplete.initialList = [pa?.destination];

        this.localiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.localiteService);
        this.localiteRemoteAutocomplete.listRessource$ = of([pa?.localite]);
        this.localiteRemoteAutocomplete.initialList = [pa?.localite];
        this.localiteRemoteAutocomplete.params.set('arrondissement', pa?.arrondissement.id);
        this.localiteRemoteAutocomplete.term.next("");

        this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementService);
        this.arrondissementRemoteAutocomplete.listRessource$ = of([pa?.arrondissement]);
        this.arrondissementRemoteAutocomplete.initialList = [pa?.arrondissement];
        this.quartierRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.quartierService);
        this.arrondissementZoneRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.zoneService);

        if (pa?.quartier) {
          this.quartierRemoteAutocomplete.listRessource$ = of([pa?.quartier]);
          this.quartierRemoteAutocomplete.initialList = [pa?.quartier];
        }

        this.quartierRemoteAutocomplete.params.set("commune", pa?.arrondissement?.commune?.id);
        this.quartierRemoteAutocomplete.term.next("");

        this.quartierRemoteAutocomplete.params.set("commune", pa?.arrondissement?.commune?.id);
        this.quartierRemoteAutocomplete.term.next("");
        if (pa?.zone) {
          this.arrondissementZoneRemoteAutocomplete.listRessource$ = of([pa?.zone]);
          this.arrondissementZoneRemoteAutocomplete.initialList = [pa?.zone];
        }
        this.arrondissementZoneRemoteAutocomplete.params.set("arrondissement", pa?.arrondissement?.id);
        this.arrondissementZoneRemoteAutocomplete.term.next("");
        this.parcellesAModifier.insert(0, this.createParcelle(pa));
        this.updateTableParcelle();
        this.onChange(parcelles.map(parcelle => parcelle.id));
        this.change.emit(parcelles);
      } else {
        this.updateTableParcelle();
       
      }
    } else {
      this.updateTableParcelle();

    }

  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['touched'] && simpleChanges['touched'].currentValue) {
      // this.parcelleForm.markAllAsTouched();
    }
  }

  writeValue(id: null | Number[]): void {
    this.parcelleChoisieId = id;
    if (id === null) {
      this.communeId=null;
      this.sectionChoisieId=null;
      this.ilotChoisieId=null;

      this.ilotRemoteAutocomplete.listRessource$=of([]);
      this.sectionRemoteAutocomplete.listRessource$=of([]);
      this.parcelleRemoteAutocomplte.listRessource$=of([]);
      this.parcelleRemoteAutocomplte.initialList=[];
      this.parcelleChoisie=null;
      this.dataSource = null;
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
    this.parcelleChoisieId=null
    this.parcelleRemoteAutocomplte.listRessource$=of([])
    this.ilotRemoteAutocomplete.listRessource$=of([])
    this.sectionRemoteAutocomplete.params.set("commune",commune?.id);
    this.sectionRemoteAutocomplete.term.next("");

    this.arrondissementRemoteAutocomplete.params.set("commune", this.communeId);
    this.arrondissementRemoteAutocomplete.term.next("");
    this.quartierRemoteAutocomplete.params.set("commune",commune.id);
    this.quartierRemoteAutocomplete.term.next(""); 
  }


  onChangeArrondissement(arrondissement:ArrondissementAutocomplete) {
    this.localiteRemoteAutocomplete.params.set("arrondissement",arrondissement.id)
    this.localiteRemoteAutocomplete.term.next(""); 
    this.arrondissementZoneRemoteAutocomplete.params.set("arrondissement",arrondissement.id)
    this.arrondissementZoneRemoteAutocomplete.term.next(""); 
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
    this.onChange(null);

    this.parcelleRemoteAutocomplte.listRessource$=of([])
    this.ilotRemoteAutocomplete.params.set("section",section?.id);
    this.ilotRemoteAutocomplete.term.next("");
  }

  ngOnDestroy() {

    this._onDestroy.next();
    this._onDestroy.complete();
    if (this.dataSource) {
      this.addNewParcelle();
    }
  }

  createParcelle(parcelle: ParcelleElement=null) {
    if (this.majPlan) {
      if (parcelle==null) {
        return this.fb.group({
          id: [null],
          superficie: [null, Validators.compose([Validators.required])],
          numero: [null, Validators.compose([Validators.required])],
          numeroAncien: [null],
          libelle: [null],
          destination: [null],
          quartier: [null],
          localite: [null],
          zone: [null],
          arrondissement: [null]
        });
      }else {
        return this.fb.group({
          id: [parcelle.id],
          superficie: [parcelle.superficie, Validators.compose([Validators.required])],
          numero: [parcelle.numero, Validators.compose([Validators.required])],
          numeroAncien: [parcelle.numeroAncien],
          libelle: [parcelle.libelle],
          destination: [parcelle?.destination?.id, Validators.compose([Validators.required])],
          quartier: [parcelle?.quartier?.id],
          localite: [parcelle?.localite?.id, Validators.compose([Validators.required])],
          zone: [parcelle?.zone?.id],
          arrondissement: [parcelle?.arrondissement?.id, Validators.compose([Validators.required])]
        });
      }
    } else {
      if (parcelle==null) {
        return this.fb.group({
          id: [null],
          superficie: [null, Validators.compose([Validators.required])],
          libelle: [null],
        });
      }else {
        return this.fb.group({
          id: [parcelle.id],
          superficie: [parcelle.superficie, Validators.compose([Validators.required])],
          libelle: [parcelle.libelle],

        });
      }
    }


  }
  addNewParcelle(parcelle: ParcelleElement = null) {
    this.parcellesAModifier.insert(0, this.createParcelle(parcelle));
    this.updateTableParcelle();
  }

  public supprimerParcelle(index){
    this.parcellesAModifier.removeAt(index);
    this.lParcelles.splice(index, 1);
    this.updateTableParcelle();
  }

  public updateTableParcelle() {
    this.dataSource.next(this.parcellesAModifier.controls);
  }



}
