import { Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommunesService } from '@sycadApp/services/data-references/territoire/communes.service';
import { IlotService } from '@sycadApp/services/cession-parcelle/ilot.service';

import { SectionService } from '@sycadApp/services/cession-parcelle/section.service';

import { CommuneAutocomplete } from '@sycadApp/models/data-references/territoire/commune.model';
import { IlotItem,IlotElement, ParcelleElement } from '@sycadApp/models/data-references/territoire/localite.model';
import { Ilot, Section } from '@sycadApp/models/data-references/contribuables/global.model';
import { catchError, map, Observable, of, Subject, Subscription, timeout } from 'rxjs';
import { RemoteAutocompleteCommuneZoneCompetence } from '@sycadApp/features/plan-cadastral-domaine/plan-cadastral-sectionnement/edition-plan-cadastral-sectionnement/creation/remote-autocomple-zone-competence';
import { ParcelleService } from '@sycadApp/services/cession-parcelle/parcelle.service';
import { RemoteAutocompleteExtend } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import { InfoParcelle } from '@sycadApp/models/data-references/contribuables/compte.model';




@Component({
  selector: 'app-choix-parcelle-public-form',
  templateUrl: './choix-parcelle-public-form.component.html',
  styleUrls: ['./choix-parcelle-public-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChoixParcellePublicFormComponent  {

  
  @Input("formGroup") 
  parcelleForm: FormGroup;

  @Input() 
  infoParcelle: InfoParcelle;

  public communeRemoteAutocomplete;
  public sectionRemoteAutocomplete = new RemoteAutocompleteExtend<Section>();
  public ilotRemoteAutocomplete = new RemoteAutocompleteExtend<Ilot>();

  get commune() { return this.parcelleForm.get('commune'); }
  get section() { return this.parcelleForm.get('section'); }
  get ilot() { return this.parcelleForm.get('ilot'); }
  get numero() { return this.parcelleForm.get('numero'); }
  get numeroAncien() { return this.parcelleForm.get('numeroAncien'); }

  private _onDestroy = new Subject<void>();

 
  public callbackAutocompleteCommune=(search:string,params:Map<string,any>)=> {
      
    return this.communeService.autocompletionPublic(search,params).pipe(
      map(response => {
        return response.body;
      }),
      catchError((err) => {
         return of([]);
       })
    );
  };

 public callbackAutocompleteSection=(search:string,params:Map<string,any>)=> {
      
  return this.sectionService.autocompletionPublic(search,params).pipe(
    map(response => {
      return response.body;
    }),
    catchError((err) => {
       return of([]);
     })
  );
};

public callbackAutocompleteIlot=(search:string,params:Map<string,any>)=> {
      
  return this.ilotService.autocompletionPublic(search,params).pipe(
    map(response => {
      return response.body;
    }),
    catchError((err) => {
       return of([]);
     })
  );
};
  constructor(
    public communeService: CommunesService,
    public sectionService: SectionService,
    public ilotService: IlotService
  ) { }

  ngOnInit(): void {


    this.communeRemoteAutocomplete=new RemoteAutocompleteExtend<CommuneAutocomplete>();
    this.communeRemoteAutocomplete.callbackAutocomplete=this.callbackAutocompleteCommune;
   this.communeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);



   setTimeout(()=>{
    if(this.infoParcelle) {
         this.numero.setValue(this.infoParcelle.numero);
        this.numeroAncien.setValue(this.infoParcelle.numeroAncien);

        if(this.infoParcelle.commune) {
          this.communeRemoteAutocomplete.listRessource$=of([this.infoParcelle.commune]);
          this.communeRemoteAutocomplete.initialList=[this.infoParcelle.commune];
          this.commune.setValue(this.infoParcelle.commune.id);
        }

        if(this.infoParcelle.section) {
          this.sectionRemoteAutocomplete.listRessource$=of([this.infoParcelle.section]);
          this.sectionRemoteAutocomplete.initialList=[this.infoParcelle.section];
          this.section.setValue(this.infoParcelle.section.id);
        }
    
        if(this.infoParcelle.ilot) {
          this.ilotRemoteAutocomplete.listRessource$=of([this.infoParcelle.ilot]);
          this.ilotRemoteAutocomplete.initialList=[this.infoParcelle.ilot];
          this.ilot.setValue(this.infoParcelle.ilot.id);
        }
     }
  
  
   });
 
 
   
  }
  ngAfterContentInit() {
    
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    //this.subscription.unsubscribe();
  }


  initSection() {
    if(!this.sectionRemoteAutocomplete.init) {
      this.sectionRemoteAutocomplete.callbackAutocomplete=this.callbackAutocompleteSection;
      this.sectionRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
      this.sectionRemoteAutocomplete.mapFunction=(section: Section)=>{
        if(section.numeroAncien) {
          section.libelle=section.numeroAncien+" - "+section.numero;
        }
        return section;
      }
    }
  }

  public onSearchCommune(eventNgSelect) {
    if(eventNgSelect.term){
      this.communeRemoteAutocomplete.term.next(eventNgSelect.term);
    }
   
  } 
  
  
  public onChangeCommune(commune:CommuneAutocomplete) {
   
    this.section.setValue(null);
    this.ilot.setValue(null);

    this.initSection();


   this.ilotRemoteAutocomplete.listRessource$=of([])
   this.sectionRemoteAutocomplete.params.set("commune",commune?.id);
   this.sectionRemoteAutocomplete.term.next("");
  }

  public onChangeSection(section: Section) {

    this.ilot.setValue(null);
    this.initIlot();
 

 this.ilotRemoteAutocomplete.params.set("section",section?.id);
 this.ilotRemoteAutocomplete.term.next("");
}
  public onSearchIlot(eventNgSelect) {
    if(eventNgSelect.term){
      this.ilotRemoteAutocomplete.term.next(eventNgSelect.term);
    }
   
  }

  public onChangeIlot(ilot:IlotItem) {
 

  // // console.log("onChangeIlot ")
  }

  public onSearchSection(eventNgSelect) {
    if(eventNgSelect.term){
      this.sectionRemoteAutocomplete.term.next(eventNgSelect.term);
    }

  }

  initIlot(){
    if(!this.ilotRemoteAutocomplete.init) {
      this.ilotRemoteAutocomplete.callbackAutocomplete=this.callbackAutocompleteIlot;
      this.ilotRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
     this.ilotRemoteAutocomplete.mapFunction=(ilot: IlotElement)=>{
        if(ilot.numeroAncien) {
          ilot.libelle=ilot.numeroAncien+" - "+ilot.numero;
        }
        return ilot;
      } 
    }
  }


  
}
