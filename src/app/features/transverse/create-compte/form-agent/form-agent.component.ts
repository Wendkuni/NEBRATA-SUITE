import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Civilite, StatusJuridiqueAutocomplete} from '@sycadApp/models/data-references/system/model';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { RemoteAutocomplete, RemoteAutocompleteExtend } from '@sycadApp/shared/form-components/model/remote-autocomplete';
import {AgentElement} from '@sycadApp/models/data-references/contribuables/agent.model';
import {Nationalite} from '@sycadApp/models/data-references/contribuables/global.model';
import {
  NationaliteAutocomplete,
  ProfessionAutocomplete,
  SituationMatrimonialeAutocomplete
} from '@sycadApp/models/data-references/contribuables/global.model';
import {DateAdapter} from '@angular/material/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {CiviliteService} from '@sycadApp/services/data-references/system/civilite-service.service';
import {SituationMatrimonialeService} from '@sycadApp/services/data-references/system/situationMatrimoniale.service';
import {NationaliteService} from '@sycadApp/services/data-references/system/nationalite.service';
import {ProfessionService} from '@sycadApp/services/data-references/system/profession.service';
import {AppConfirmService} from '@sycadApp/shared/app-confirm/app-confirm.service';
import {catchError, map, takeUntil} from 'rxjs/operators';
import { of, Subject} from 'rxjs';
import {getErrors} from '@sycadShared/validators/global-pattern';
import {AgentsService} from '@sycadApp/services/data-references/contribuables/agent.service';
import {BureauAutocomplete} from '@sycadApp/models/data-references/organigramme/bureau.model';
import {StructureAutocomplete} from '@sycadApp/models/data-references/organigramme/structure.model';
import {ServiceAutocomplete} from '@sycadApp/models/data-references/organigramme/service.model';
import {ServiceAdministratifService} from '@sycadApp/services/data-references/organigramme/ServiceAdministratif.service';
import {StructureService} from '@sycadApp/services/data-references/organigramme/structure.service';
import {BureauService} from '@sycadApp/services/data-references/organigramme/bureau.service';
import { CompteElement } from '@sycadApp/models/data-references/contribuables/compte.model';


@Component({
  selector: 'app-form-agent',
  templateUrl: './form-agent.component.html',
  styleUrls: ['./form-agent.component.scss']
})
export class FormAgentComponent implements OnInit {

  @Input("formGroup") 
  formulaire: FormGroup;

    
  @Input()
  public compteContribuable: CompteElement;

  public formulaireAgent: FormGroup;
  public  agent: AgentElement;
  public isLoadingResults = false;
  public formErrors: Array<string>;
  public maxDateNaissance;
  public minDateNaissance;

  public civilityRemoteAutocomplete = new RemoteAutocompleteExtend<Civilite>();
  public nationaliteRemoteAutocomplete = new RemoteAutocompleteExtend<Nationalite>();
  public situationMatrimonialeRemoteAutocomplete = new RemoteAutocompleteExtend<SituationMatrimonialeAutocomplete>();
  public professionRemoteAutocomplete = new RemoteAutocompleteExtend<ProfessionAutocomplete>();
  public statusJuridiqueRemoteAutocomplete = new RemoteAutocompleteExtend<StatusJuridiqueAutocomplete>();
  public bureauRemoteAutocomplete = new RemoteAutocompleteExtend<BureauAutocomplete>();
  public structureRemoteAutocomplete = new RemoteAutocompleteExtend<StructureAutocomplete>();
  public serviceRemoteAutocomplete = new RemoteAutocompleteExtend<ServiceAutocomplete>();

  private _onDestroy = new Subject<void>();
  public activeMediaQuery = '';
  ngAfterContentInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `${change.mqAlias}` : 'xl';
    });
  }

  get prenoms() { return this.formulaire.get('prenoms'); }
  get nom() { return this.formulaire.get('nom'); }
  get nomDeJeuneFille() { return this.formulaire.get('nomDeJeuneFille'); }
  get lieuNaissance() { return this.formulaire.get('lieuNaissance'); }
  get dateNaissance() { return this.formulaire.get('dateNaissance'); }
  get genre() { return this.formulaire.get('genre'); }
  get civilite() { return this.formulaire.get('civilite'); }
  get profession() { return this.formulaire.get('profession'); }
  get nationalite() { return this.formulaire.get('nationalite');}
  get matricule() { return this.formulaire.get('matricule'); }
  get fonction() { return this.formulaire.get('fonction'); }
  get service() { return this.formulaire.get('affectation').get('service'); }
  get bureau() { return this.formulaire.get('affectation').get('bureau'); }
  get structure() { return this.formulaire.get('affectation').get('structure'); }
  get pieceOfficielle() {return this.formulaire.get("pieceOfficielle");}
  get prenomsPere() { return this.formulaireAgent.get('prenomsPere'); }
  get nomPere() { return this.formulaireAgent.get('nomPere'); }
  get prenomsMere() { return this.formulaireAgent.get('prenomsMere'); }
  get nomMere() { return this.formulaireAgent.get('nomMere'); }
  get telephone() { return this.formulaire.get('telephone');}
  get email() { return this.formulaire.get('email');}
  get numeroIfu() { return this.formulaire.get('numeroIfu');}

  constructor(public fb: FormBuilder, private _adapter: DateAdapter<any>,
              public confirmService: AppConfirmService,
              private _snackBar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public agentService: AgentsService,
              public serviceAdminService: ServiceAdministratifService,
              public structureService: StructureService,
              public bureauService: BureauService,
              public civiliteService: CiviliteService,
              public situationMatrimonialeService: SituationMatrimonialeService,
              public nationaliteService: NationaliteService,
              public professionService: ProfessionService,
              private router: Router) {}

  ngOnInit(): void {
    this.formulaire.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.formErrors = getErrors(this.formulaire);
    });

    this._adapter.setLocale("fr");

    let currentDate = new Date();
    this.maxDateNaissance = new Date(currentDate.getFullYear() - 10, currentDate.getMonth(), currentDate.getDay());
    this.minDateNaissance = new Date(currentDate.getFullYear() - 70, currentDate.getMonth(), currentDate.getDay());

    this.civilityRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
    this.civilityRemoteAutocomplete.callbackAutocomplete=(search:string,params:Map<string,any>)=> {
      return this.civiliteService.autocompletionPublic(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };
    this.situationMatrimonialeRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
    this.situationMatrimonialeRemoteAutocomplete.callbackAutocomplete=(search:string,params:Map<string,any>)=> {
      return this.situationMatrimonialeService.autocompletionPublic(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };
    
    this.nationaliteRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
    this.nationaliteRemoteAutocomplete.callbackAutocomplete=(search:string,params:Map<string,any>)=> {
      return this.nationaliteService.autocompletionPublic(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };

    this.professionRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
    this.professionRemoteAutocomplete.callbackAutocomplete=(search:string,params:Map<string,any>)=> {
      return this.professionService.autocompletionPublic(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };


    this.structureRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
    this.structureRemoteAutocomplete.callbackAutocomplete=(search:string,params:Map<string,any>)=> {
      return this.structureService.autocompletionPublic(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };


  
    this.serviceRemoteAutocomplete.callbackAutocomplete=(search:string,params:Map<string,any>)=> {
      return this.serviceAdminService.autocompletionPublic(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };

  
    this.bureauRemoteAutocomplete.callbackAutocomplete=(search:string,params:Map<string,any>)=> {
      return this.bureauService.autocompletionPublic(search,params).pipe(
        map(response => {
          return response.body;
        }),
        catchError((err) => {
           return of([]);
         })
      );
    };
    if(this.compteContribuable) {  
      let informationsContribuable =  this.compteContribuable.informationsContribuable;

    if(informationsContribuable?.nationalite) {
      this.nationaliteRemoteAutocomplete.listRessource$=of([informationsContribuable.nationalite]);
      this.nationaliteRemoteAutocomplete.initialList=[informationsContribuable.nationalite];
    }

   
    if(informationsContribuable?.civilite) {
      this.civilityRemoteAutocomplete.listRessource$=of([informationsContribuable.civilite]);
      this.civilityRemoteAutocomplete.initialList=[informationsContribuable.civilite];
    }

    if(informationsContribuable.affectation?.bureau) {
      this.bureauRemoteAutocomplete.listRessource$=of([informationsContribuable.affectation.bureau]);
      this.bureauRemoteAutocomplete.initialList=[informationsContribuable.affectation.bureau];
    }
    if(informationsContribuable.affectation?.structure) {
      this.structureRemoteAutocomplete.listRessource$=of([informationsContribuable.affectation.structure]);
      this.structureRemoteAutocomplete.initialList=[informationsContribuable.affectation.structure];
      this.serviceRemoteAutocomplete.params.set("structure",informationsContribuable.affectation.structure.code);
      this.bureauRemoteAutocomplete.params.set("structure",informationsContribuable.affectation.structure.code);
    }
    if(informationsContribuable.affectation?.service) {
      this.serviceRemoteAutocomplete.listRessource$=of([informationsContribuable.affectation.service]);
      this.serviceRemoteAutocomplete.initialList=[informationsContribuable.affectation.service];
      this.bureauRemoteAutocomplete.params.set("service",informationsContribuable.affectation.service.code);
    }
    
    if(informationsContribuable?.situationMatrimoniale) {
      this.situationMatrimonialeRemoteAutocomplete.listRessource$=of([informationsContribuable.situationMatrimoniale]);
      this.situationMatrimonialeRemoteAutocomplete.initialList=[informationsContribuable.situationMatrimoniale];
    }

    if(informationsContribuable?.situationMatrimoniale) {
      this.situationMatrimonialeRemoteAutocomplete.listRessource$=of([informationsContribuable.situationMatrimoniale]);
      this.situationMatrimonialeRemoteAutocomplete.initialList=[informationsContribuable.situationMatrimoniale];
    }

    if(informationsContribuable?.profession) {
      this.professionRemoteAutocomplete.listRessource$=of([informationsContribuable.profession]);
      this.professionRemoteAutocomplete.initialList=[informationsContribuable.profession];
    }

    if(informationsContribuable?.nationalite) {
      this.nationaliteRemoteAutocomplete.listRessource$=of([informationsContribuable.nationalite]);
      this.nationaliteRemoteAutocomplete.initialList=[informationsContribuable.nationalite];
    }
 
    if(this.compteContribuable.transmission.structure) {
      this.structureRemoteAutocomplete.listRessource$=of([this.compteContribuable.transmission.structure]);
      this.structureRemoteAutocomplete.initialList=[this.compteContribuable.transmission.structure];
    }

    }

  }

  public onSearchCivilite(eventNgSelect) {
    this.civilityRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchSituationMatrimonial(eventNgSelect) {
    this.situationMatrimonialeRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchNationalite(eventNgSelect) {
    this.nationaliteRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchProfession(eventNgSelect) {
    this.professionRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchStatusJuridique(eventNgSelect) {
    this.statusJuridiqueRemoteAutocomplete.term.next(eventNgSelect.term);
  }
  public onSearchBureau(eventNgSelect) {
    this.bureauRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchStructure(eventNgSelect) {
    this.structureRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onSearchService(eventNgSelect) {
    this.serviceRemoteAutocomplete.term.next(eventNgSelect.term);
  }

  public onChangeStructure(structure:StructureAutocomplete) {

    if(!this.serviceRemoteAutocomplete.init){
      this.serviceRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
    }
   
    if(!this.bureauRemoteAutocomplete.init){
      this.bureauRemoteAutocomplete.initializeRemoteAutocompletion(this._onDestroy);
    }
    this.serviceRemoteAutocomplete.resetParams();
    this.serviceRemoteAutocomplete.initialList=[];
    this.service.reset();

    this.bureauRemoteAutocomplete.resetParams();
    this.bureauRemoteAutocomplete.initialList=[];
    this.bureau.reset();
   //// console.log("structure",structure)
    if(structure){
      this.serviceRemoteAutocomplete.params.set("structure",structure.code);
      this.serviceRemoteAutocomplete.term.next("");


      this.bureauRemoteAutocomplete.params.set("structure",structure.code);
      this.bureauRemoteAutocomplete.term.next("");

    }


  }
  public onChangeService(service:ServiceAutocomplete) {

    this.bureauRemoteAutocomplete.resetParams();
    this.bureauRemoteAutocomplete.initialList=[];
    this.bureau.reset();

    if(service) {
      this.bureauRemoteAutocomplete.params.set("service",service.code);
      this.bureauRemoteAutocomplete.term.next("");
    }

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 25000,
      verticalPosition: "top",
    });
  }

}
