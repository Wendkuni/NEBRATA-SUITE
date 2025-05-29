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
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import { IlotService } from '@sycadApp/services/cession-parcelle/ilot.service';
import { AbstractControl, ControlValueAccessor, FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { IlotElement, IlotItem, LocaliteAutocomplete, ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { RemoteAutocomplete } from '@sycadShared/form-components/model/remote-autocomplete';
import { Section } from '@sycadApp/models/data-references/contribuables/global.model';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { RemoteAutocompleteArrondissementZoneCompetence, RemoteAutocompleteCommuneZoneCompetence } from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import { MatTableDataSource } from '@angular/material/table';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { ArrondissementZoneService } from '@sycadApp/services/data-references/territoire/arrondissement-zone.service';
import { DestinationParcelle } from '@sycadApp/models/bornage/destinationParcelle.model';
import { Quartier } from '@sycadApp/models/data-references/territoire/quartier.model';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { QuartierService } from '@sycadApp/services/data-references/territoire/quartier.service';
import { ArrondissementAutocomplete, ArrondissementElement, ArrondissementZone } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';

@Component({
  selector: 'app-parcelle-form-ajouter',
  templateUrl: './parcelle-form-ajouter.component.html',
  styleUrls: ['./parcelle-form-ajouter.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ParcelleFormAjouterComponent), multi: true }],
})
export class ParcelleFormAjouterComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
  @Input()
  touched: boolean; 

  @Input('formGroup')
  parcellesAAjouter: FormArray;
  @Input('parcelleChoisie')
  parcelleChoisie: ParcelleElement[];

  @Input('proprietaire')
  proprietaire: string;

  @Input('structure')
  structure: any;

  @Input('simpleContribuable')
  simpleContribuable: boolean;

  @Input("arrondissement")
  arrondissement: ArrondissementElement;
  
  @Input('ordre')
  ordre ?: boolean;

  @Input('numero')
  numero ?: boolean;

  @Input('isNumeroParcelle')
  isNumeroParcelle:boolean;
  
  public dataSource = new BehaviorSubject<AbstractControl[]>([]);

  @Output('change')
  public change: EventEmitter<ParcelleElement[]> = new EventEmitter<ParcelleElement[]>();

  public parcelleChoisieId: Number[];
  public sectionChoisieId: number;
  /* public ilotChoisieId: number; */
  public communeId: number;

  groupByFnArrondissement = (item) => item.commune.nom;
  groupValueFnArrondissement = (_: string, communes: any[]) => ({ name: communes[0].commune.nom, total: communes.length });
  

  public parcelleRemoteAutocomplte = new RemoteAutocomplete<ParcelleElement>();

  public destinationRemoteAutocomplete = new RemoteAutocomplete<DestinationParcelle>();
  public quartierRemoteAutocomplete = new RemoteAutocomplete<Quartier>();
  public localiteRemoteAutocomplete = new RemoteAutocomplete<LocaliteAutocomplete>();
  public arrondissementRemoteAutocomplete ;
  /* public arrondissementZoneRemoteAutocomplete=new RemoteAutocomplete<ArrondissementZone>(); */

  public communeRemoteAutocomplete;
  public sectionRemoteAutocomplete = new RemoteAutocomplete<Section>();
  public ilotRemoteAutocomplete = new RemoteAutocomplete<IlotElement>();
  public dataSourceParcelles = new MatTableDataSource<ParcelleElement>();
  public displayedColumns: string[] = ['ilot','numero', 'numeroAncien', 'libelle', 'superficie', 'ordre','destination','arrondissement',  'quartier', 'localite', 'action'];
  public  displayedColumns1: string[] = ['ilot','numeroAncien', 'libelle', 'superficie', 'ordre','destination','arrondissement',  'quartier', 'localite', 'action'];

  private _onDestroy = new Subject<void>();

  onChange: any = (_: Number) => { };

  onTouch: any = () => { };

  constructor(public parcelleService: ParcelleService,
    public communeService: CommunesService,
    public sectionService: SectionService,
    public ilotService: IlotService,
    private fb: FormBuilder,
    public localiteService: LocaliteService,
    public arrondissementService:ArrondissementsService,
    public zoneService: ArrondissementZoneService,
    public destinationParcelleService: DestinationParcelleService,
    public quartierService: QuartierService

  ) { }

  ngOnInit(): void {



    this.destinationRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.destinationParcelleService);

    /* this.arrondissementZoneRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.zoneService); */
   

    if (this.simpleContribuable) {
      this.communeRemoteAutocomplete = new RemoteAutocomplete<CommuneAutocomplete>();
      this.arrondissementRemoteAutocomplete=new RemoteAutocomplete<ArrondissementAutocomplete>();
    } else {
      this.communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();
      this.arrondissementRemoteAutocomplete= new RemoteAutocompleteArrondissementZoneCompetence<ArrondissementAutocomplete>();
    }

    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    // this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementService);


    if (this.parcelleChoisie && this.parcelleChoisie.length > 0) {
      this.localiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.localiteService);
      this.quartierRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.quartierService);
      this.communeRemoteAutocomplete.listRessource$ = of([this.parcelleChoisie[0]?.arrondissement.commune]);
      this.communeRemoteAutocomplete.initialList = [this.parcelleChoisie[0]?.arrondissement.commune];
      this.communeId = this.parcelleChoisie[0]?.arrondissement.commune.id;

      this.sectionRemoteAutocomplete.params.set("commune", this.communeId);     
      this.sectionRemoteAutocomplete.listRessource$ = of([this.parcelleChoisie[0]?.ilot.section]);
      this.sectionRemoteAutocomplete.initialList = [this.parcelleChoisie[0]?.ilot.section];
      this.sectionChoisieId = this.parcelleChoisie[0]?.ilot.section.id;


      this.arrondissementRemoteAutocomplete.params.set("commune", this.communeId);
      this.arrondissementRemoteAutocomplete.listRessource$ = of([this.parcelleChoisie[0]?.arrondissement]);
      this.arrondissementRemoteAutocomplete.initialList = [this.parcelleChoisie[0]?.arrondissement];
      this.initSection();


      this.ilotRemoteAutocomplete.params.set("section", this.sectionChoisieId);
      this.ilotRemoteAutocomplete.listRessource$ = of([this.parcelleChoisie[0]?.ilot]);
      this.ilotRemoteAutocomplete.initialList = [this.parcelleChoisie[0]?.ilot];
     
      this.initIlot();
      let destination=[];
      let localite=[]
      let quartier=[]
      this.parcelleChoisie.forEach(element=>{
        destination.push(element.destination);
        localite.push(element.localite);
        quartier.push(element.quartier);
      });

      this.destinationRemoteAutocomplete.listRessource$=of(destination)
      this.destinationRemoteAutocomplete.initialList=destination;
    
      this.quartierRemoteAutocomplete.listRessource$=of(quartier);
      this.quartierRemoteAutocomplete.initialList=quartier;
    
      this.localiteRemoteAutocomplete.listRessource$=of(localite);
      this.localiteRemoteAutocomplete.initialList=localite;
      
      this.parcelleChoisie.map((parcelle) => {

        this.quartierRemoteAutocomplete.params.set("commune", parcelle?.arrondissement?.commune?.id);
        this.quartierRemoteAutocomplete.term.next("");
        this.localiteRemoteAutocomplete.params.set('arrondissement', parcelle?.arrondissement.id);
        this.localiteRemoteAutocomplete.term.next("");
        this.parcellesAAjouter.insert(0, this.createParcelle(parcelle));
        this.updateTableParcelle();
    });

    }
  }



  public onSearchParcelle(eventNgSelect) {
    this.parcelleRemoteAutocomplte.term.next(eventNgSelect.term);
  }


  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['touched'] && simpleChanges['touched'].currentValue) {
      // this.parcelleForm.markAllAsTouched();
    }
  }

 

  writeValue(id: null | Number[]): void {
    this.parcelleChoisieId = id;
    if (id === null) {
      this.communeId = null;
      this.sectionChoisieId = null;

      this.ilotRemoteAutocomplete.listRessource$ = of([]);
      this.sectionRemoteAutocomplete.listRessource$ = of([]);
      this.parcelleRemoteAutocomplte.listRessource$ = of([]);
      this.parcelleRemoteAutocomplte.initialList = [];
      this.parcelleChoisie = null;
      this.dataSource = null;
      this.parcelleRemoteAutocomplte.resetParams();
      this.ilotRemoteAutocomplete.resetParams();
      this.sectionRemoteAutocomplete.resetParams();
      this.arrondissementRemoteAutocomplete.resetParams();
    }

  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: Number) => {}): void {
    this.onTouch = fn;
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

  public onSearchArrondissement(eventNgSelect) {
    this.arrondissementRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onChangeCommune(commune: CommuneAutocomplete) {

    this.initSection();
    this.sectionChoisieId = null;
    this.parcelleChoisie = null;
    this.parcelleChoisieId = null
    //this.supprimerAllParcelle();
    this.onChange(null);
    this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementService);
    this.quartierRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.quartierService);
    this.parcelleRemoteAutocomplte.listRessource$ = of([]);
    this.ilotRemoteAutocomplete.listRessource$ = of([]);
    this.sectionRemoteAutocomplete.params.set("commune", commune?.id);
    this.arrondissementRemoteAutocomplete.params.set("commune", commune?.id);
    this.quartierRemoteAutocomplete.params.set("commune",commune.id);
    this.sectionRemoteAutocomplete.term.next("");
    this.arrondissementRemoteAutocomplete.term.next("");
    this.quartierRemoteAutocomplete.term.next(""); 
  }

  onChangeArrondissement(arrondissement:ArrondissementAutocomplete) {
    this.localiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.localiteService);
    this.localiteRemoteAutocomplete.params.set("arrondissement",arrondissement.id)
    this.localiteRemoteAutocomplete.term.next(""); 
  }

  public onSearchIlot(eventNgSelect) {
    this.ilotRemoteAutocomplete.term.next(eventNgSelect.term);
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


  public onChangeIlot(ilot: IlotItem) {

    this.parcelleChoisie = null;
    this.parcelleChoisieId = null;
    this.parcelleRemoteAutocomplte.params.set("ilot", ilot?.id);
    this.parcelleRemoteAutocomplte.term.next("");
  }

  public onSearchSection(eventNgSelect) {
    this.sectionRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  initIlot() {
    if (!this.ilotRemoteAutocomplete.init) {
      this.ilotRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.ilotService);
      this.ilotRemoteAutocomplete.mapFunction = (ilot: IlotElement) => {
        if (ilot.numeroAncien) {
          ilot.libelle = ilot.numeroAncien + " - " + ilot.numero;
        }
        return ilot;
      }
    }
  }

  public onChangeSection(section: Section) {
    this.initIlot();
    this.parcelleChoisie = null;
    this.parcelleChoisieId = null;
    this.onChange(null);

    this.parcelleRemoteAutocomplte.listRessource$ = of([])
    this.ilotRemoteAutocomplete.params.set("section", section?.id);
    this.ilotRemoteAutocomplete.term.next("");
  }

 
  ngOnDestroy() {

    this._onDestroy.next();
    this._onDestroy.complete();
    if (this.dataSource) {
      this.addNewParcelle();
    }
  }

  createParcelle(parcelle: ParcelleElement = null) {

    if (parcelle == null) {
      return this.fb.group({
        id: [null],
        ilot: [null],
        superficie: [null, Validators.compose([Validators.required])],
        numero: [null],
        numeroAncien: [null],
        arrondissement:[null],
        libelle: [null],
        destination: [null, Validators.compose([Validators.required])],
        quartier: [null],
        localite: [null, Validators.compose([Validators.required])],
        ordre: [null]
        /*  zone: [null] */
      });
    }
    else {
      return this.fb.group({
        id: [parcelle.id],
        ilot: [parcelle.ilot.id],
        superficie: [parcelle.superficie, Validators.compose([Validators.required])],
        numero: [parcelle.numero],
        numeroAncien: [parcelle.numeroAncien],
        libelle: [parcelle.libelle],
        arrondissement:[parcelle.arrondissement?.id],
        destination: [parcelle.destination?.id, Validators.compose([Validators.required])],
        quartier: [parcelle.quartier?.id],
        localite: [parcelle.localite?.id, Validators.compose([Validators.required])],
        ordre: [parcelle.ordre]
        /*  zone: [null] */
      });
    }

  }
  addNewParcelle(parcelle: ParcelleElement = null) {
    this.parcellesAAjouter.insert(0, this.createParcelle(parcelle));
    this.updateTableParcelle();
  }

  public supprimerParcelle(index) {
    this.parcellesAAjouter.removeAt(index);
    this.updateTableParcelle();
  }

  public updateTableParcelle() {
    this.dataSource.next(this.parcellesAAjouter.controls);
  }

  supprimerAllParcelle() {
    while (this.parcellesAAjouter.length !== 0) {
      this.parcellesAAjouter.removeAt(0);
      this.updateTableParcelle();
    }
  }

}
