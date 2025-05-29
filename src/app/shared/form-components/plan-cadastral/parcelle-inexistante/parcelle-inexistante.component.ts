import { Component, forwardRef, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import {  catchError, map, of, Subject } from 'rxjs';
import { RemoteAutocomplete, RemoteAutocompleteExtendBehavior } from '../../model/remote-autocomplete';
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ArrondissementsService } from '@sycadApp/services/data-references/territoire/arrondissements.service';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { QuartierService } from '@sycadApp/services/data-references/territoire/quartier.service';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { EtatMiseEnValeur } from '@sycadApp/models/impot/bareme-impot.model';
import { ArrondissementAutocomplete } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { RemoteAutocompleteArrondissementZoneCompetence, RemoteAutocompleteCommuneZoneCompetence } from '@sycadApp/features/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import { LocaliteAutocomplete, LocaliteElement, ParcelleInexistante} from '@sycadApp/models/data-references/territoire/localite.model';
import { Quartier } from '@sycadApp/models/data-references/territoire/quartier.model';
@Component({
  selector: 'app-parcelle-inexistante',
  templateUrl: './parcelle-inexistante.component.html',
  styleUrls: ['./parcelle-inexistante.component.scss'],
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ParcelleInexistanteComponent), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class ParcelleInexistanteComponent implements OnInit, OnDestroy{

  private _onDestroy = new Subject<void>();

  selectedCommune: CommuneAutocomplete | null = null;
  selectedArrondissement: any = null;
  selectedQuartier: any = null;

  localiteId= null;
  quartierId=null;

  @Input()
  parcelleInexistanteForm: FormGroup;

  @Input()
  parcelleInexistanteElement: ParcelleInexistante;

  onChange: any = (_: Number) => { };
  onTouch: any = () => { };

  public communeRemoteAutocomplete = new RemoteAutocompleteCommuneZoneCompetence<CommuneAutocomplete>();


  public arrondissementRemoteAutocomplete= new RemoteAutocompleteExtendBehavior<ArrondissementAutocomplete>();
  // public arrondissementRemoteAutocomplete= new RemoteAutocompleteArrondissementZoneCompetence<ArrondissementAutocomplete>();
  public localiteRemoteAutocomplete= new RemoteAutocomplete<LocaliteAutocomplete>();

  public quartierRemoteAutocomplete= new RemoteAutocomplete<Quartier>();
  public destinationRemoteAutocomplete= new RemoteAutocomplete<any>();
  public etatMiseEnValeurRemoteAutocomplete= new RemoteAutocomplete<any>();
  public etatMiseEnValeurOptions: { value: EtatMiseEnValeur; label: string }[] = []; // Options pour l'énumération


  get commune() { return this.parcelleInexistanteForm.get('commune'); }
  get arrondissement() { return this.parcelleInexistanteForm.get('arrondissement'); }
  get localite() { return this.parcelleInexistanteForm.get('localite'); }
  get quartier() { return this.parcelleInexistanteForm.get('quartier'); }
  get destination() { return this.parcelleInexistanteForm.get('destination'); }
  get section() { return this.parcelleInexistanteForm.get('section'); }
  get ilot() { return this.parcelleInexistanteForm.get('ilot'); }
  get numero() { return this.parcelleInexistanteForm.get('numero'); }
  get superficie() { return this.parcelleInexistanteForm.get('superficie'); }
  get etatMiseEnValeur(){return this.parcelleInexistanteForm.get('etatMiseEnValeur')}

  constructor(
    private communeService: CommunesService,
    private arrondissementService: ArrondissementsService,
    private localiteService: LocaliteService,
    private quartierService: QuartierService,
    private destinationService: DestinationParcelleService,

  ) {}

  ngOnInit(): void {
    this.initializeAutocomplete();
    this.loadEtatMiseEnvaleurOptions(); // Charger les options de l'énumération
    this.parcelleInexistanteElement = this.parcelleInexistanteForm.value;
    if(this.parcelleInexistanteElement?.commune){
      this.communeRemoteAutocomplete.listRessource$=of([this.parcelleInexistanteElement.commune]);
      this.communeRemoteAutocomplete.initialList= [this.parcelleInexistanteElement.commune];
      this.parcelleInexistanteForm.patchValue({
        commune: this.parcelleInexistanteElement.commune?.id
      });
    }

    if(this.parcelleInexistanteElement?.arrondissement){
      // this.arrondissementRemoteAutocomplete.listRessource$=of([this.parcelleInexistanteElement.arrondissement]);
      this.initArrondissement();
      this.arrondissementRemoteAutocomplete.initialList= [this.parcelleInexistanteElement.arrondissement];
      this.parcelleInexistanteForm.patchValue({
        arrondissement: this.parcelleInexistanteElement.arrondissement?.id
      });
    }

    if(this.parcelleInexistanteElement?.localite){
      this.localiteRemoteAutocomplete.listRessource$=of([this.parcelleInexistanteElement.localite]);
      this.localiteRemoteAutocomplete.initialList= [this.parcelleInexistanteElement.localite];
      this.parcelleInexistanteForm.patchValue({
        localite: this.parcelleInexistanteElement.localite?.id
      });
    }

    if(this.parcelleInexistanteElement?.quartier){
      this.quartierRemoteAutocomplete.listRessource$=of([this.parcelleInexistanteElement.quartier]);
      this.quartierRemoteAutocomplete.initialList= [this.parcelleInexistanteElement.quartier];
      this.parcelleInexistanteForm.patchValue({
        quartier: this.parcelleInexistanteElement.quartier?.id
      });
    }

    if(this.parcelleInexistanteElement?.destination){
      this.destinationRemoteAutocomplete.listRessource$=of([this.parcelleInexistanteElement.destination]);
      this.destinationRemoteAutocomplete.initialList= [this.parcelleInexistanteElement.destination];
      this.parcelleInexistanteForm.patchValue({
        destination: this.parcelleInexistanteElement.destination?.id
      });
    }
    
    if(this.parcelleInexistanteElement?.etatMiseEnValeur){
      this.etatMiseEnValeurRemoteAutocomplete.listRessource$=of([this.parcelleInexistanteElement.etatMiseEnValeur]);
      this.etatMiseEnValeurRemoteAutocomplete.initialList= [this.parcelleInexistanteElement.etatMiseEnValeur];
      this.parcelleInexistanteForm.patchValue({
        etatMiseEnValeur : this.parcelleInexistanteElement.etatMiseEnValeur
      });
  }
  }

  initializeAutocomplete() {
    // Initialize autocomplete for each with the service
    this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.communeService);
    this.destinationRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy,this.destinationService);
  }

  loadEtatMiseEnvaleurOptions() {
    this.etatMiseEnValeurOptions = Object.keys(EtatMiseEnValeur)
      .filter(key => isNaN(Number(key))) // Filtrer les clés qui ne sont pas des nombres
      .map(key => ({
        value: EtatMiseEnValeur[key],
        label: EtatMiseEnValeur[key]
      }));
  }

public onChangeCommune(commune: CommuneAutocomplete | null) {
  if (!commune) {
    // Vider les listes et réinitialiser les valeurs sélectionnées
    this.selectedArrondissement = null;
    this.selectedQuartier = null;

    // Effacer les valeurs sélectionnées dans le formulaire
    this.arrondissement.reset();
    this.quartier.reset();
    this.localite.reset();

    // Effacer les listes des arrondissements et quartiers
    this.localiteRemoteAutocomplete.listRessource$ = of([]);
    // this.arrondissementRemoteAutocomplete.listRessource$ = of([]);
    this.quartierRemoteAutocomplete.listRessource$ = of([]);
    
  } else {
       this.onChange(null);
       this.selectedCommune = commune;
      //  this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.arrondissementService);
      this.initArrondissement();
       this.arrondissementService.autocompletionByCommune
       this.quartierRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.quartierService);
 
       // Filtrer les arrondissements et quartiers par commune
       this.arrondissementRemoteAutocomplete.params.set('commune', commune.id);
       this.quartierRemoteAutocomplete.params.set('commune', commune.id);
 
       // Vider la liste des localités pour une nouvelle recherche
       this.localiteRemoteAutocomplete.listRessource$ = of([]);
  }
}

public callbackAutocompleteArrondissement=(search:string,params:Map<string,any>)=> {
    return this.arrondissementService.autocompletionByCommune(search,params).pipe(
      map(response => {
        return response.body;
      }),
      catchError((err) => {
        return of([]);
      })
    );
  };
  initArrondissement() {
    if(!this.arrondissementRemoteAutocomplete.init) {
      this.arrondissementRemoteAutocomplete.callbackAutocomplete=this.callbackAutocompleteArrondissement;
      this.arrondissementRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
      this.arrondissementRemoteAutocomplete.mapFunction=(arrondissement: ArrondissementAutocomplete)=>{
        return arrondissement;
      }
    }
  }

  // Méthode pour mettre à jour l'autocomplétion en fonction de l'arrondissement choisi
  public onChangeArrondissement(arrondissement: ArrondissementAutocomplete | null ) {
    if (!arrondissement) {
      // Si aucun arrondissement sélectionné, vider la liste des localités
      this.localiteRemoteAutocomplete.listRessource$ = of([]);
      this.localite.reset();
    } else {
      // Met à jour les localités selon l'arrondissement sélectionné
      this.localiteRemoteAutocomplete.resetParams();
      this.localiteRemoteAutocomplete.params.set('arrondissement', arrondissement.id);
      this.localiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.localiteService);
    }
  }

  onSearchCommune(eventNgSelect) {
    this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
  }

   onSearchArrondissement(eventNgSelect) {
    this.arrondissementRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  onSearchLocalite(eventNgSelect) {
    this.localiteRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  onSearchQuartier(eventNgSelect) {
    this.quartierRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  onSearchDestination(eventNgSelect) {
    this.destinationRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
