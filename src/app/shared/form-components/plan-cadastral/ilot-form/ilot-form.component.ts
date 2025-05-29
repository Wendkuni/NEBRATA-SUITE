
import { RemoteAutocomplete } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { DateAdapter } from '@angular/material/core';
import { LocaliteAutocomplete, ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { DestinationParcelle } from '@sycadApp/models/bornage/destinationParcelle.model';
import { Quartier } from '@sycadApp/models/data-references/territoire/quartier.model';
import { ArrondissementAutocomplete, ArrondissementElement, ArrondissementZone } from '@sycadApp/models/data-references/territoire/arrondissement.model';
import { QuartierService } from '@sycadApp/services/data-references/territoire/quartier.service';
import { Section } from '@sycadApp/models/data-references/contribuables/global.model';
import { DestinationParcelleService } from '@sycadApp/services/bornage/destination-parcelle.service';
import { LocaliteService } from '@sycadApp/services/data-references/territoire/localite.service';
import { ArrondissementZoneService } from '@sycadApp/services/data-references/territoire/arrondissement-zone.service';
import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';
import {RemoteAutocompleteZoneArrondissementCompetence} from '@sycadFeature/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';

@Component({
  selector: 'app-ilot-form',
  templateUrl: './ilot-form.component.html',
  styleUrls: ['./ilot-form.component.scss']
})
export class IlotFormComponent implements OnInit {

  @Input("formGroup") 
  ilotForm: FormGroup;


  @Input("arrondissement") 
  arrondissement: ArrondissementElement;
  

  public destinationRemoteAutocomplete = new RemoteAutocomplete<DestinationParcelle>();
  public quartierRemoteAutocomplete = new RemoteAutocomplete<Quartier>();
  public localiteRemoteAutocomplete = new RemoteAutocomplete<LocaliteAutocomplete>();
  public sectionRemoteAutocomplete = new RemoteAutocomplete<Section>();
   public arrondissementZoneRemoteAutocomplete=new RemoteAutocompleteZoneArrondissementCompetence<ArrondissementZone>();
  public dataSource = new BehaviorSubject<AbstractControl[]>([]);

  private _onDestroy = new Subject<void>();
  
  get numero() { return this.ilotForm.get('numero'); }
  get section() { return this.ilotForm.get('section'); }
  get numeroAncien() { return this.ilotForm.get('numeroAncien'); }
  get parcelles() { return this.ilotForm.controls.parcelles as FormArray; }

  
  public activeMediaQuery = '';

  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }
  constructor(
    private fb: FormBuilder,
    public _snackBar: MatSnackBar,
    public _adapter: DateAdapter<any>,
    private mediaObserver: MediaObserver,
    public destinationParcelleService: DestinationParcelleService,
    public quartierService: QuartierService,
    public localiteService: LocaliteService,
    public zoneService: ArrondissementZoneService,
    public sectionService: SectionService,
    ) {}

  
  ngOnInit(): void {

    this._adapter.setLocale("fr");

   

    this.sectionRemoteAutocomplete.params.set("commune",this.arrondissement?.commune.id);
    this.sectionRemoteAutocomplete.term.next("");

    this.quartierRemoteAutocomplete.params.set("commune", this.arrondissement?.commune?.id);
    this.quartierRemoteAutocomplete.term.next("");
 
     this.localiteRemoteAutocomplete.params.set("arrondissement",this.arrondissement.id);
     this.localiteRemoteAutocomplete.term.next(""); 

    this.arrondissementZoneRemoteAutocomplete.params.set("arrondissement", this.arrondissement.id);
    this.arrondissementZoneRemoteAutocomplete.term.next("");
     /* this.arrondissementZoneRemoteAutocomplete.listRessource$ = of([this.ilotForm.value?.zone]);
     this.arrondissementZoneRemoteAutocomplete.initialList = [this.ilotForm.value?.zone]; */  
    
  

    if(this.ilotForm.value?.section) {
      this.sectionRemoteAutocomplete.listRessource$=of([this.ilotForm.value.section]);
      this.sectionRemoteAutocomplete.initialList=[this.ilotForm.value.section];
     this.ilotForm.patchValue({
       section:this.ilotForm.value.section.id
     });
    }
    
    if(this.parcelles.controls.length>0) {
     

      let idFilterDestination=[];
      let lesDestinations=[];

      let idFilterQuartier=[];
      let lesQuartiers=[];

      let idFilterLocalite=[];
      let lesLocalites=[];

      for (let index = 0; index < this.parcelles.controls.length; index++) {
        let parcelleFormCotrol =  this.parcelles.controls[index];
        let destination=parcelleFormCotrol.value.destination;
        let quartier=parcelleFormCotrol.value.quartier;
        let localite=parcelleFormCotrol.value.localite;

       if(idFilterDestination.indexOf(destination.id)<0) {
          lesDestinations.push(destination);
          idFilterDestination.push(destination.id)
        } 

        if(quartier && idFilterQuartier.indexOf(quartier.id)<0) {
          lesQuartiers.push(quartier);
          idFilterQuartier.push(quartier.id)
        } 
        if( idFilterLocalite.indexOf(localite.id)<0) {
          lesLocalites.push(localite);
          idFilterLocalite.push(localite.id)
        } 
        parcelleFormCotrol.get("destination").setValue(destination.id);
        if(quartier) {
          parcelleFormCotrol.get("quartier").setValue(quartier.id);
        }       
        parcelleFormCotrol.get("localite").setValue(localite.id);
      }

     
      this.destinationRemoteAutocomplete.listRessource$=of(lesDestinations);
      this.destinationRemoteAutocomplete.initialList=lesDestinations;
     
      if(lesQuartiers.length>0) {
            this.quartierRemoteAutocomplete.listRessource$=of(lesQuartiers);
            this.quartierRemoteAutocomplete.initialList=lesQuartiers;
      }

      this.localiteRemoteAutocomplete.listRessource$=of(lesLocalites);
      this.localiteRemoteAutocomplete.initialList=lesLocalites;
      
      this.updateTableParcelle();
  
    }  
    

    this.destinationRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.destinationParcelleService);
    this.quartierRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.quartierService);
    this.localiteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.localiteService);
    this.sectionRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.sectionService);
    this.arrondissementZoneRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy, this.zoneService);

  }
  ngOnDestroy() {

    this._onDestroy.next();
    this._onDestroy.complete();

    this.addNewParcelle();
  }

  displayedColumns: string[] = ['numero', 'numeroAncien', 'libelle','superficie','destination','quartier','localite','zone','action'];  

   onChangeSection(section:Section){
    this.quartierRemoteAutocomplete.params.set("comune",section.commune?.id);
    this.quartierRemoteAutocomplete.term.next(""); 
  } 
  createParcelle(parcelle:ParcelleElement=null) {

    if(parcelle==null) {
      return this.fb.group({
        id: [null],
        numero: [null, Validators.compose([Validators.required])],
        numeroAncien: [null],
        libelle: [null],
        destination: [null, Validators.compose([Validators.required])],
        superficie: [null, Validators.compose([Validators.required])],
        quartier: [null],
        localite: [null, Validators.compose([Validators.required])],
        zone: [null],
      });
    }else {
      return this.fb.group({
        id: [parcelle.id],
        numero: [parcelle.numero, Validators.compose([Validators.required])],
        numeroAncien: [parcelle.numeroAncien],
        libelle: [parcelle.libelle],
        destination: [parcelle.destination?.id, Validators.compose([Validators.required])],
        superficie: [parcelle.superficie, Validators.compose([Validators.required])],
        quartier: [parcelle.quartier?.id],
        localite: [parcelle.localite?.id, Validators.compose([Validators.required])],
        zone: [parcelle.zone?.id],
      });
    }
   
  }
  addNewParcelle() {
    this.parcelles.insert(0, this.createParcelle());
    this.updateTableParcelle();
  }
  public onChangeCommune(commune: CommuneAutocomplete) {
    this.quartierRemoteAutocomplete.params.set("commune",commune.id);
    this.quartierRemoteAutocomplete.term.next(""); 
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

  /*public onSearchZone(eventNgSelect){
    this.arrondissementZoneRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  */

  public onSearchSection(eventNgSelect){
    this.sectionRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public supprimerParcelle(index){
   this.parcelles.removeAt(index);
  this.updateTableParcelle();
  }

  public updateTableParcelle() {
    this.dataSource.next(this.parcelles.controls);
  }
  
}
