import { CommunesService } from './../../../../../services/data-references/territoire/communes.service';
import { Component, OnInit, OnDestroy, OnChanges,forwardRef, SimpleChanges, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor,NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { Subject, Subscription, catchError, map, of } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { RemoteAutocompleteExtend } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { LocaliteAutocomplete } from '@sycadApp/models/data-references/territoire/localite.model';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { Quartier } from '@sycadApp/models/data-references/territoire/quartier.model';
import { QuartierService } from '@sycadApp/services/data-references/territoire/quartier.service';

export interface AdresseFormValue {
  id: number;
  libelle: string;
  localite: number;
  principal: boolean;
  rue: string;
  porte: string;
  quartier: string;
  parcelle:number;
}

@Component({
  selector: 'app-adresse-form',
  templateUrl: './adresse-form.component.html',
  styleUrls: ['./adresse-form.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AdresseFormComponent), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class AdresseFormComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges  {

  @Input() touched: boolean;
  private _onDestroy = new Subject<void>();
  @Input("formGroup") adesseForm: FormGroup;

  initializedCommune: boolean = false;
  initializedQuartier: boolean = false;

  @Input() noManagedPrincipal: boolean;

  @Input() publicApi: boolean=false;
  public communeRemoteAutocomplete = new RemoteAutocompleteExtend<CommuneAutocomplete>();
  public quartierRemoteAutocomplete = new RemoteAutocompleteExtend<Quartier>();

  onChange: any = (_: AdresseFormValue) => {};
  onTouch: any = () => {};
  paysList: string[] = [
    'Afghanistan', 'Afrique du Sud', 'Albanie', 'Algérie', 'Andorre', 'Angola', 'Antigua-et-Barbuda', 
    'Arabie Saoudite', 'Argentine', 'Arménie', 'Australie', 'Autriche', 'Azerbaïdjan', 'Bahamas', 
    'Bahreïn', 'Bangladesh', 'Barbade', 'Belgique', 'Bélarus', 'Belize', 'Bénin', 'Bhoutan', 'Bolivie', 
    'Bosnie-Herzégovine', 'Botswana', 'Brésil', 'Brunei', 'Bulgarie', 'Burkina Faso', 'Burundi', 'Butswana', 
    'Cabo Verde', 'Cambodge', 'Cameroun', 'Canada', 'Centrafrique', 'Chili', 'Chine', 'Chypre', 'Colombie', 
    'Comores', 'Congo', 'Congo (République du)', 'Costa Rica', 'Croatie', 'Cuba', 'Danemark', 'Djibouti', 
    'Dominique', 'Dominique', 'Égypte', 'El Salvador', 'Équateur', 'Érythrée', 'Espagne', 'Estonie', 'Eswatini', 
    'États-Unis', 'Éthiopie', 'Fidji', 'Finlande', 'France', 'Gabon', 'Gambie', 'Géorgie', 'Ghana', 'Grèce', 
    'Grenade', 'Guatemala', 'Guinée', 'Guinée-Bissau', 'Guyana', 'Haïti', 'Honduras', 'Hongrie', 'Inde', 'Indonésie', 
    'Irak', 'Iran', 'Irlande', 'Islande', 'Israël', 'Italie', 'Jamaïque', 'Japon', 'Jordanie', 'Kazakhstan', 
    'Kenya', 'Kiribati', 'Koweït', 'Kirghizistan', 'Laos', 'Lesotho', 'Lettonie', 'Liban', 'Liberia', 'Libye', 
    'Liechtenstein', 'Lituanie', 'Luxembourg', 'Madagascar', 'Malaisie', 'Malawi', 'Maldives', 'Mali', 'Malte', 
    'Maroc', 'Maurice', 'Mauritanie', 'Mexique', 'Micronésie', 'Moldavie', 'Monaco', 'Mongolie', 'Monténégro', 
    'Mozambique', 'Namibie', 'Nauru', 'Népal', 'Nicaragua', 'Niger', 'Nigeria', 'Norvège', 'Nouvelle-Zélande', 
    'Oman', 'Ouganda', 'Pakistan', 'Palaos', 'Panama', 'Papouasie-Nouvelle-Guinée', 'Paraguay', 'Pays-Bas', 'Pérou', 
    'Philippines', 'Pologne', 'Portugal', 'Qatar', 'République tchèque', 'République du Congo', 'République Dominicaine', 
    'Roumanie', 'Royaume-Uni', 'Russie', 'Rwanda', 'Saint-Christophe-et-Niévès', 'Saint-Marin', 'Saint-Vincent-et-les-Grenadines', 
    'Sainte-Lucie', 'Salvador', 'Samoa', 'Sao Tomé-et-Principe', 'Sénégal', 'Serbie', 'Seychelles', 'Sierra Leone', 
    'Singapour', 'Slovaquie', 'Slovénie', 'Somalie', 'Soudan', 'Soudan du Sud', 'Sri Lanka', 'Suède', 'Suisse', 
    'Syrie', 'Tadjikistan', 'Tanzanie', 'Tchad', 'Thaïlande', 'Timor oriental', 'Togo', 'Tonga', 'Trinité-et-Tobago', 
    'Tunisie', 'Turkménistan', 'Turquie', 'Tuvalu', 'Ukraine', 'Uruguay', 'Vanuatu', 'Vatican', 'Venezuela', 
    'Viêt Nam', 'Yémen', 'Zambie', 'Zimbabwe'
  ];

  private subscription = new Subscription();

  get libelle() {return this.adesseForm.get("libelle");}
  get localite() { return this.adesseForm.get("localite");}
  get principal() {return this.adesseForm.get("principal");}
  get rue() {return this.adesseForm.get("rue");}
  get porte() {return this.adesseForm.get("porte");}
  get quartier() {return this.adesseForm.get("quartier");}
  get pays() {return this.adesseForm.get("pays");}
  get ville() {return this.adesseForm.get("ville");}

  constructor(
    private mediaObserver: MediaObserver,
    private communeService: CommunesService,
    private quartierService: QuartierService,
    public localiteService: LocaliteService
  ) {}


  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  addVille(name: string) {
    let communeAutocomplete: CommuneAutocomplete = new CommuneAutocomplete();
    communeAutocomplete.nom = name;
    return communeAutocomplete;
  }

  addQuartier(name: string) {
    let quartier: Quartier = new Quartier();
    quartier.nom = name;
    return quartier;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.adesseForm.valueChanges.subscribe((value: AdresseFormValue) => {
        this.onChange(value);
      })
    );

    if(this.adesseForm.value.id && this.adesseForm.value.localite) {
      this.localiteRemoteAutocomplete.listRessource$=of([this.adesseForm.value.localite]);
      this.localiteRemoteAutocomplete.initialList=[this.adesseForm.value.localite];
      this.adesseForm.patchValue({
        localite:this.adesseForm.value.localite.id
      });
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.subscription.unsubscribe();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['touched'] && simpleChanges['touched'].currentValue) {
      this.adesseForm.markAllAsTouched();
    }
  }

  writeValue(value: null | AdresseFormValue): void {
    if (value) {
      this.adesseForm.reset(value);
    }
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: AdresseFormValue) => {}): void {
    this.onTouch = fn;
  }

  @Output()
  public changeAdressePrincipal: EventEmitter<AdresseFormValue> = new EventEmitter<AdresseFormValue>();

  public onChangeAdressePrincipal(adresse) {
    this.changeAdressePrincipal.emit(adresse);
  }

  public onChangeVille(ville){
    if(ville){
      let callbackAutocompleteLocalite = null;
      let callbackAutocompleteQuartier = null;

      if(this.publicApi){
        callbackAutocompleteLocalite=(search:string,params:Map<string,any>)=> {
          return this.localiteService.autocompletionPublic(search,params).pipe(
            map(response => {
              return response.body;
            }),
            catchError((err) => {
               return of([]);
             })
          );
        };

        callbackAutocompleteQuartier=(search:string,params:Map<string,any>)=> {
          return this.quartierService.autocompletionByCommunePublic(search, ville.id, params).pipe(
            map(response => {
              return response.body;
            }),
            catchError((err) => {
              return of([]);
            })
          );
        };
      } else {
        callbackAutocompleteLocalite=(search:string,params:Map<string,any>)=> {
          return this.localiteService.autocompletionByCommune(search, ville.id, params).pipe(
            map(response => {
              return response.body;
            }),
            catchError((err) => {
               return of([]);
             })
          );
        };

        callbackAutocompleteQuartier=(search:string,params:Map<string,any>)=> {
          return this.quartierService.autocompletionByCommune(search, ville.id, params).pipe(
            map(response => {
              return response.body;
            }),
            catchError((err) => {
              return of([]);
            })
          );
        };
      }

      this.quartierRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
      this.quartierRemoteAutocomplete.callbackAutocomplete=callbackAutocompleteQuartier;

      this.localiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
      this.localiteRemoteAutocomplete.callbackAutocomplete=callbackAutocompleteLocalite;
    }
  }

  public onChangePays(pays){

    if(pays == "Burkina Faso" && !this.initializedCommune){
      let callbackAutocompleteCommune = null;
      
      if(this.publicApi){

        callbackAutocompleteCommune=(search:string,params:Map<string,any>)=> {
          return this.communeService.autocompletionPublic(search,params).pipe(
            map(response => {
              return response.body;
            }),
            catchError((err) => {
              return of([]);
            })
          );
        };        

      } else {
        callbackAutocompleteCommune=(search:string,params:Map<string,any>)=> {
          return this.communeService.autocompletion(search,params).pipe(
            map(response => {
              return response.body;
            }),
            catchError((err) => {
              return of([]);
            })
          );
        };
      }

      this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
      this.communeRemoteAutocomplete.callbackAutocomplete=callbackAutocompleteCommune;

      this.initializedCommune = true;

    } else {
      this.initializedCommune = false;
      this.communeRemoteAutocomplete.listRessource$=of([]);
    }
  }

  public localiteRemoteAutocomplete = new RemoteAutocompleteExtend<LocaliteAutocomplete>();

  public onSearchLocalite(eventNgSelect) {
    this.localiteRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchVille(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
  }
}
